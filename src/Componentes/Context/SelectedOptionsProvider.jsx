import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import ModelConfig from "../../Models/ModelConfig";
import User from "../../Models/User";
import ModelSales from "../../Models/Sales";
import ProductSold from "../../Models/ProductSold";
import LoadingDialog from "../Dialogs/LoadingDialog";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ToastAndroid,
  Platform,
  Keyboard
} from "react-native";
import { Snackbar } from "react-native-paper";
import Product from "../../Models/Product";
import System from "../../Helpers/System";
//import NuevoProductoExpress from "../ScreenDialog/NuevoProductoExpress";
import Client from "../../Models/Client";
//import PedirSupervision from "../ScreenDialog/PedirSupervision";
import UserEvent from "../../Models/UserEvent";
import StorageSesion from "src/Helpers/StorageSesion";
//import ScreenDialogBuscarCliente from "../ScreenDialog/BuscarCliente";
import Log from "src/Models/Log";
import LastSale from "src/Models/LastSale";

import { ProviderModalesContext } from "../Context/ProviderModales";

export const SelectedOptionsContext = React.createContext();
export const SelectedOptionsProvider = ({ children }) => {

  const {
    setShowAsignarPeso,
    productoSinPeso,
    setProductoSinPeso,
    setonAsignWeight,
    onConfirmAsignWeight,

    setShowNuevoExpress,
    setCodigoNuevoExpress,
    setHandleGuardarNuevoProducto,
    codigoNuevoExpress,

    productoSinPrecio,
    setProductoSinPrecio,
    showAsignarPrecio,
    setShowAsignarPrecio,
    setOnAsignPrice

    // setShowConfirmDialog,
    // textConfirm,
    // setTextConfirm,
    // setHandleConfirm,
    // setHandleNotConfirm,

    // setOpenSnackbar,
    // snackMessage,
    // setSnackMessage,


    // setShowAlert,
    // setTitleMsg,
    // textMsg,
    // setTextMsg,

    // showDialogSelectClientModal,
    // setShowDialogSelectClientModal,
    // setClienteModal,
    // clienteModal,
    // setAskLastSaleModal,
    // setAddToSalesDataModal,

  } = useContext(ProviderModalesContext);


  //init configs values
  const [sales, setSales] = useState(new ModelSales());
  const [ultimoVuelto, setUltimoVuelto] = useState(null);

  const [snackMessage, setSnackMessage] = useState("");
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [tieneFocoTeclado, setTieneFocoTeclado] = useState(false);
  //valor oara mostrar snackbar

  const searchInputRef = useRef(null);

  const [apretoEnterEnBuscar, setApretoEnterEnBuscar] = useState(null);

  const focusSearchInput = () => {
    console.log("focusSearchInput")
    System.intentarFoco(searchInputRef, () => { })
  };

  const showAlert = (title, text) => {
    if (!text) {
      text = title;
      title = "Atención";
    }

    // Para Android: usar ToastAndroid
    if (Platform.OS === 'android') {
      //ToastAndroid.show(text, ToastAndroid.SHORT);
      ToastAndroid.show(text, ToastAndroid.LONG);
    }
    // Para iOS: mantener el Alert.alert tradicional
    else {
      Alert.alert(title, text);
    }
  };



  const [CONFIG, setCONFIG] = useState(null);
  const init = async () => {
    // console.log("init de SelectedOptionsProvider");
    setCONFIG(await ModelConfig.getInstance().getFirst());

    setModoAvion(!await ModelConfig.get("emitirBoleta"))
    const tieneUltimaVenta = await LastSale.getInstance().sesion.hasOne()
    // console.log("tieneUltimaVenta", tieneUltimaVenta)
    if (tieneUltimaVenta) {
      const dt = await LastSale.loadFromSesion()
      console.log("dt", Object.keys(dt))
      if (dt) {
        if (!ultimoVuelto) {
          console.log("dt.data.vuelto", dt.data.vuelto)
          setUltimoVuelto(dt.data.vuelto)
        }
        setAskLastSale(dt)
      }
    }
  };

  useEffect(() => {
    init();
  }, []);


  //set general dialog variables
  const [showLoadingDialog, setShowLoadingDialogx] = useState(false);
  const [loadingDialogText, setLoadingDialogText] = useState("");

  const [showPrintButton, setShowPrintButton] = useState(null);
  const [suspenderYRecuperar, setSuspenderYRecuperar] = useState(null);

  useEffect(() => {
    (async () => {
      setShowPrintButton(await ModelConfig.get("showPrintButton"));
      setSuspenderYRecuperar(await ModelConfig.get("suspenderYRecuperar"));
    })();
  }, []);
  ////mostrar mensaje snackbar

  const showSnackbarMessage = (message) => {
    console.log("showSnackbarMessage called with:", message);
    setSnackMessage(message);
    console.log("Set snack message to:", message);
    setVisibleSnackbar(true);
    console.log("Set visible to true");
  };

  const showMessage = (message) => {
    console.log("showMessage..", message)
    setSnackMessage(message)
    setVisibleSnackbar(true)
  }

  const hideSnackbar = () => {
    setVisibleSnackbar(false);
  };

  //mostrar un dialog con la animacion del cargando
  const setShowLoadingDialog = (value) => {
    setShowLoadingDialogx(value);
  };

  const setShowLoadingDialogWithTitle = (textToShow = "", value) => {
    setLoadingDialogText(textToShow);
    setShowLoadingDialogx(value);
  };

  const showLoading = (textToShow = "") => {
    setLoadingDialogText(textToShow);
    setShowLoadingDialogx(true);
  };

  //ocultar el dialog en x milisegundos
  const hideLoadingDialog = (timeOut = 10) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  };

  const hideLoading = (timeOut = 10) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  };

  const [cliente, setCliente] = useState(null);
  const [askLastSale, setAskLastSale] = useState(true);
  const [showDialogSelectClient, setShowDialogSelectClient] = useState(false);

  const [productInfo, setProductInfo] = useState(/* initial value */);

  const [description, setDescription] = useState(/* initial value */);
  const [quantity, setQuantity] = useState(1);
  const [precioData, setPrecioData] = useState(null);
  const [ventaData, setVentaData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [products, setProducts] = useState([]);
  // const [clientName, setClientName] = useState("");
  const [salesDataTimestamp, setSalesDataTimestamp] = useState(Date.now());

  // const [selectedCodigoCliente, setSelectedCodigoCliente] = useState("");
  // const [selectedCodigoClienteSucursal, setSelectedCodigoClienteSucursal] = useState("");

  const [selectedUser, setSelectedUser] = useState([]);
  // const [searchText, setSearchText] = useState("");

  const [selectedChipIndex, setSelectedChipIndex] = useState([]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [textConfirm, setTextConfirm] = useState("");
  const [handleConfirm, setHandleConfirm] = useState(null);
  const [handleNotConfirm, setHandleNotConfirm] = useState(null);

  const [verPedirSupervision, setVerPedirSupervision] = useState(false);
  const [accionPedirSupervision, setAccionPedirSupervision] = useState("");
  const [handleConfirmarSupervision, setHandleConfirmarSupervision] =
    useState(null);
  const [datosConfirmarSupervision, setDatosConfirmarSupervision] = useState(
    {}
  );

  const pedirSupervision = (accion, callbackOk, datos) => {
    setAccionPedirSupervision(accion);
    setDatosConfirmarSupervision(datos);
    setHandleConfirmarSupervision(() => callbackOk);
    setVerPedirSupervision(true);
  };

  const showConfirm = (text, callbackYes, callbackNo = () => { }) => {
    Alert.alert('Confirmar', text, [
      {
        text: 'Si',
        onPress: callbackYes,
      },
      {
        text: 'No',
        onPress: callbackNo
      },
    ]);
  };

  const [showAlertDialog, setShowAlert] = useState(false);
  const [titleMsg, setTitleMsg] = useState("");
  const [textMsg, setTextMsg] = useState("");

  const [modoAvion, setModoAvion] = useState(true)



  const [searchResults, setSearchResults] = useState([]);
  const [textSearchProducts, setTextSearchProducts] = useState(""); //variable del cuadro de busqueda
  const [buscarCodigoProducto, setBuscarCodigoProducto] = useState(false);
  const [showTecladoBuscar, setShowTecladoBuscar] = useState(false);

  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  const [userData, setUserData] = useState(null);

  const updateUserData = async (data) => {
    setUserData(await User.getInstance().saveInSesion(data));
  };

  const getUserData = async () => {
    if (await User.getInstance().sesion.hasOne())
      setUserData(await User.getInstance().getFromSesion());
  };

  useEffect(() => {
    if (!userData)
      getUserData()
  }, [userData]);

  useEffect(() => {
    setGrandTotal(sales.getTotal());
  }, [salesData]);

  useEffect(() => {
    setSalesDataTimestamp(Date.now());
  }, [salesData, grandTotal]); // Add other dependencies as needed

  useEffect(() => {
    (async () => {
      if (
        salesData.length == 0 &&
        (await sales.sesionProducts.hasOne()) &&
        (await sales.sesionProducts.getFirst()).length > 0
      ) {
        setSalesData(await sales.loadFromSesion());
      }
    })();
  }, [salesData]);

  useEffect(() => {
    (async () => {
      if (!cliente) {
        const clientStatic = Client.getInstance();
        if (await clientStatic.sesion.hasOne()) {
          setCliente(await clientStatic.getFromSesion());
        }
      }
    })();
  }, [cliente]);



  const addToSalesData = async (product, quantity, withAlert = false) => {
    console.log("addToSalesData")
    Log("product", product)
    // console.log("")
    // console.log("")

    console.log("quantity", quantity)
    if (!quantity && product.cantidad) quantity = product.cantidad;

    const sePuedeVenderPrecio0 = await ModelConfig.get("permitirVentaPrecio0");

    console.log("sePuedeVenderPrecio0", sePuedeVenderPrecio0)
    if (parseFloat(product.precioVenta) <= 0 && !sePuedeVenderPrecio0) {
      console.log("debe asignar precio")
      setProductoSinPrecio(product);
      // setShowAsignarPrecio(true);
    } else {
      // if (
      //   (quantity === 1 || quantity == undefined)
      //   && ProductSold.getInstance().esPesable(product)) {
      //   setShowAsignarPeso(true)
      //   setProductoSinPeso(product)

      // } else {

      if (!quantity && ProductSold.getInstance().esPesable(product)) {
        // product.quantity = 1;
        console.log("debe asignar peso")
        setProductoSinPeso(product)
      } else {
        var totalAntesPrecio = sales.getTotal();
        var totalAntesCantidad = sales.getTotalCantidad();
        setSalesData([]);
        sales.addProduct(product, quantity);

        setTimeout(async () => {
          setSalesData(await sales.loadFromSesion());

          var totalDespuesPrecio = sales.getTotal();
          var totalDespuesCantidad = sales.getTotalCantidad();

          // console.log("totalAntesPrecio", totalAntesPrecio)
          // console.log("totalDespuesPrecio", totalDespuesPrecio)
          // console.log("totalAntesCantidad", totalAntesCantidad)
          // console.log("totalDespuesCantidad", totalDespuesCantidad)

          if (
            totalAntesPrecio != totalDespuesPrecio ||
            totalAntesCantidad != totalDespuesCantidad
          )
            if (withAlert) {
              showAlert("Agregado correctamente");
            } else {
              showMessage("Agregado correctamente");
            }
        }, 300);

        setUltimoVuelto(null);

        UserEvent.send({
          name: "agrega producto " + product.nombre,
        });
      }
    }
  };

  const replaceToSalesData = (keyProductRemove, productPut) => {
    sales.replaceProduct(keyProductRemove, productPut);
    setSalesData(sales.products);
    setGrandTotal(sales.getTotal());
  };

  const handlerOnAsignPrice = (newPrice) => {
    console.log("onAsignPrice..newPrice", newPrice)
    // productoSinPrecio.codigoSucursal = 0
    // productoSinPrecio.puntoVenta = "0000"
    productoSinPrecio.fechaIngreso = System.getInstance().getDateForServer();
    productoSinPrecio.precioVenta = newPrice;

    Product.getInstance().assignPrice(
      productoSinPrecio,
      (response) => {
        addToSalesData(productoSinPrecio);
        setProductoSinPrecio(null);
        setShowAsignarPrecio(false);
        showMessage(response.descripcion);
      },
      () => {
        showMessage("No se pudo actualizar el precio");
      }
    );
  };


  useEffect(() => {
    if (productoSinPrecio) {
      setOnAsignPrice((x) => handlerOnAsignPrice)
      setShowAsignarPrecio(true)
    } else {
      setShowAsignarPrecio(false)
    }
  }, [productoSinPrecio])


  useEffect(() => {
    if (codigoNuevoExpress != 0) {
      setHandleGuardarNuevoProducto((x) => handleGuardarNuevoProducto)
      setShowNuevoExpress(true)
    } else {
      setShowNuevoExpress(false)
    }
  }, [codigoNuevoExpress])

  const addNewProductFromCode = (code) => {
    console.log("addNewProductFromCode..", code)
    if (code < 0) code = code * -1;
    setCodigoNuevoExpress(code);
  };

  const handleGuardarNuevoProducto = (nuevoProducto) => {
    nuevoProducto.fechaIngreso = System.getInstance().getDateForServer();
    // nuevoProducto.codigoSucursal = 0
    // nuevoProducto.puntoVenta = "0000"

    Product.getInstance().newProductFromCode(
      nuevoProducto,
      (serverInfo) => {
        console.log(serverInfo);
        nuevoProducto.idProducto = parseInt(nuevoProducto.codSacanner);
        addToSalesData(nuevoProducto);
        setCodigoNuevoExpress(0);
        setShowNuevoExpress(false);
        showMessage(serverInfo.descripcion);
      },
      () => {
        showMessage("No se pudo realizar");
      }
    );
  };

  const clearSessionData = async () => {
    await User.getInstance().sesion.truncate();
    setUserData(null);
    setCliente(null);
    await Client.getInstance().sesion.truncate();
    clearSalesData();
  };

  const clearSalesData = () => {
    setSalesData([]);
    sales.products = [];
    sales.sesionProducts.truncate();
    setGrandTotal(0);
    setTimeout(() => {
      setSalesDataTimestamp(Date.now());
    }, 400);
  };
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleNumberClick = (value) => {
    // Existing code...

    // Add the selected button and its amount to the state
    setSelectedButtons([...selectedButtons, { value, amount: payment }]);
  };

  // Function to calculate the total amount from selected buttons
  const calculateTotalAmount = () => {
    return selectedButtons.reduce((total, button) => total + button.amount, 0);
  };

  const calculateTotalPrice = (quantity, price) => {
    var pr = new ProductSold();
    pr.quantity = quantity;
    pr.price = price;
    console.log("calculateTotalPrice..");
    console.log(pr.getSubTotal());
    return pr.getSubTotal();
  };

  const removeFromSalesData = (index) => {
    console.log("removeFromSalesData")

    UserEvent.send({
      name: "quita producto " + sales.products[index].description,
    });
    setSalesData(sales.removeFromIndex(index));
    focusSearchInput();
  };

  const incrementQuantity = (index, productInfo) => {
    setSalesData(sales.incrementQuantityByIndex(index, 1));
  };

  const decrementQuantity = (index, productInfo) => {
    setSalesData(sales.decrementQuantityByIndex(index, 1));
  };



  useEffect(() => {

    if (productoSinPeso) {
      const realOnAsignWeight = (newPeso) => {
        // console.log("realOnAsignWeight")
        // console.log("realOnAsignWeight..newPeso", newPeso)
        // console.log("realOnAsignWeight..productoSinPeso", productoSinPeso)
        addToSalesData(productoSinPeso, newPeso)
        setProductoSinPeso(null)
        setShowAsignarPeso(false)
      }
      // console.log("setonAsignWeight", realOnAsignWeight)
      setonAsignWeight((x) => realOnAsignWeight)
      setShowAsignarPeso(true)
      // setHandleConfirm(() => callbackYes)
    } else {
      setShowAsignarPeso(false)
    }
  }, [productoSinPeso]);



  const GeneralElements = () => {
    return (
      <>
        <Snackbar
          visible={visibleSnackbar}
          onDismiss={hideSnackbar}
          style={{ position: "static", marginHorizontal: "10%", width: "80%", zIndex: 10 }}
          duration={3000}
          action={{
            label: "OK",
            onPress: hideSnackbar,
          }}
        >
          {snackMessage}
        </Snackbar>
        {/* <TecladoAlfaNumerico
          onEnter={() => {
            setBuscarCodigoProducto(true);
          }}
          showFlag={showTecladoBuscar}
          varChanger={setTextSearchProducts}
          varValue={textSearchProducts}
        />
        {showTecladoBuscar && (
        <TouchableOpacity
          onPress={() => {
            setShowTecladoBuscar(false);
            setVisibleSnackbar(false);
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
          }}
          activeOpacity={1}
        />
      )}

        <Snackbar
          visible={visibleSnackbar}
          onDismiss={()=>{setVisibleSnackbar(false)}}
          duration={3000}
          action={{
            label: "OK",
            onPress: ()=>{setVisibleSnackbar(false)},
          }}
        >
          {snackMessage}
        </Snackbar>; */}


        <LoadingDialog openDialog={showLoadingDialog} text={loadingDialogText} />

        {/* <NuevoProductoExpress
          openDialog={showNuevoExpress}
          setOpenDialog={setShowNuevoExpress}
          onComplete={handleGuardarNuevoProducto}
          codigoIngresado={codigoNuevoExpress}
        /> */}




        {/* <PedirSupervision
          openDialog={verPedirSupervision}
          accion={accionPedirSupervision}
          infoEnviar={datosConfirmarSupervision}
          setOpenDialog={setVerPedirSupervision}
          onConfirm={() => {
            if (handleConfirmarSupervision) handleConfirmarSupervision()
          }}
        /> */}


        {/* <ScreenDialogBuscarCliente
          openDialog={showDialogSelectClient}
          setOpenDialog={setShowDialogSelectClient}
          setCliente={setCliente}
          askLastSale={askLastSale}
          addToSalesData={addToSalesData}
        /> */}
      </>
    );
  };

  return (
    <SelectedOptionsContext.Provider
      value={{
        init,
        GeneralElements,
        snackMessage,

        showSnackbarMessage,

        showConfirm,
        showAlert,
        showMessage,

        showLoadingDialog,
        setShowLoadingDialog,
        setShowLoadingDialogWithTitle,
        hideLoadingDialog,
        hideLoading,
        loadingDialogText,
        setLoadingDialogText,
        showLoading,

        sales,
        salesData,
        setSalesData,
        grandTotal,
        setGrandTotal,

        addToSalesData,
        replaceToSalesData,

        removeFromSalesData,
        incrementQuantity,
        decrementQuantity,
        clearSalesData,
        products,
        setProducts,
        salesDataTimestamp,
        // suspenderVenta,
        productInfo,
        setProductInfo,
        quantity,
        selectedUser,
        setSelectedUser,
        clearSessionData,
        calculateTotalPrice,
        description,
        setDescription,
        userData,
        updateUserData,
        getUserData,
        precioData,
        setPrecioData,
        ventaData,
        setVentaData,
        searchResults,
        setSearchResults,
        updateSearchResults,

        ultimoVuelto,
        setUltimoVuelto,
        // selectedCodigoCliente,
        // setSelectedCodigoCliente,
        // selectedCodigoClienteSucursal,
        // setSelectedCodigoClienteSucursal,
        // selectedChipIndex,
        // setSelectedChipIndex,
        // searchText,
        // setSearchText,

        textSearchProducts,
        searchInputRef,
        setTextSearchProducts,
        buscarCodigoProducto,
        setBuscarCodigoProducto,
        showTecladoBuscar,
        setShowTecladoBuscar,

        addNewProductFromCode,

        // clientName,
        // setClientName,
        cliente,
        setCliente,
        askLastSale,
        setAskLastSale,
        showDialogSelectClient,
        setShowDialogSelectClient,

        modoAvion,
        setModoAvion,

        showPrintButton,
        setShowPrintButton,

        suspenderYRecuperar,
        setSuspenderYRecuperar,

        pedirSupervision,
        hideSnackbar,
        searchInputRef,
        focusSearchInput,


        tieneFocoTeclado,
        setTieneFocoTeclado,

        apretoEnterEnBuscar,
        setApretoEnterEnBuscar

      }}
    >
      {children}

      {GeneralElements()}
    </SelectedOptionsContext.Provider>
  );
};

export default SelectedOptionsProvider;
