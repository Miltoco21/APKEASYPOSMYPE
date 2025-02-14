/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo, useRef } from "react";
import ModelConfig from "../../Models/ModelConfig";
import User from "../../Models/User"

import ModelSales from "../../Models/Sales";
import ProductSold from "../../Models/ProductSold";
import LoadingDialog from "../Dialogs/LoadingDialog";
import AsignarPrecio from "../ScreenDialog/AsignarPrecio";

import TecladoAlfaNumerico from "../Teclados/TecladoAlfaNumerico";


// import {
//   Typography,
//   Snackbar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button
// } from "@mui/material";


import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,

  Image
} from "react-native";
import Snackbar from 'react-native-paper';


import Product from "../../Models/Product";
import System from "../Helpers/System";
//import NuevoProductoExpress from "../ScreenDialog/NuevoProductoExpress";
//import AsignarPeso from "../ScreenDialog/";
import Confirm from "../Dialogs/Confirm";
import Client from "../../Models/Client";
import Alert from "../Dialogs/Alert";
//import PedirSupervision from "../ScreenDialog/PedirSupervision";
import UserEvent from "../../Models/UserEvent";
//import ScreenDialogBuscarCliente from "../ScreenDialog/BuscarCliente";

export const SelectedOptionsContext = React.createContext();

export const SelectedOptionsProvider = ({ children }) => {

  
  //init configs values
  const [sales, setSales] = useState(new ModelSales())
  const [ultimoVuelto, setUltimoVuelto] = useState(null)
  //const [openSnackbar, setVisibleSnackbar] = useState(false);

  const [snackMessage, setSnackMessage] = useState("");
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  //valor oara mostrar snackbar 

  const searchInputRef = useRef(null)

  const showMessage = (message) => {
    setSnackMessage(message)
    setVisibleSnackbar(true)
  }

  const [CONFIG, setCONFIG] = useState(null)
  const init = () => {
    // console.log("init de SelectedOptionsProvider");
    setCONFIG(ModelConfig.getInstance().getFirst())
  }

  useEffect(() => {
    init();
  }, []);

  //set general dialog variables
  const [showLoadingDialog, setShowLoadingDialogx] = useState(false)
  const [loadingDialogText, setLoadingDialogText] = useState("")

  const [showPrintButton, setShowPrintButton] = useState(ModelConfig.get("showPrintButton"))

  const [suspenderYRecuperar, setSuspenderYRecuperar] = useState(ModelConfig.get("suspenderYRecuperar"));



  //mostrar un dialog con la animacion del cargando
  const setShowLoadingDialog = (value) => {
    setShowLoadingDialogx(value);
  }

  const setShowLoadingDialogWithTitle = (textToShow = "", value) => {
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(value);
  }

  const showLoading = (textToShow = "") => {
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(true);
  }

  //ocultar el dialog en x milisegundos
  const hideLoadingDialog = (timeOut = 200) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  }

  const hideLoading = (timeOut = 200) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  }

  const [cliente, setCliente] = useState(null)
  const [askLastSale, setAskLastSale] = useState(true)
  const [showDialogSelectClient, setShowDialogSelectClient] = useState(false)

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

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [textConfirm, setTextConfirm] = useState("")
  const [handleConfirm, setHandleConfirm] = useState(null)
  const [handleNotConfirm, setHandleNotConfirm] = useState(null)

  const [verPedirSupervision, setVerPedirSupervision] = useState(false)
  const [accionPedirSupervision, setAccionPedirSupervision] = useState("")
  const [handleConfirmarSupervision, setHandleConfirmarSupervision] = useState(null)
  const [datosConfirmarSupervision, setDatosConfirmarSupervision] = useState({})

  const pedirSupervision = (accion, callbackOk, datos) => {
    setAccionPedirSupervision(accion)
    setDatosConfirmarSupervision(datos)
    setHandleConfirmarSupervision(() => callbackOk)
    setVerPedirSupervision(true)
  }

  const showConfirm = (text, callbackYes, callbackNo) => {
    setTextConfirm(text)
    setHandleConfirm(() => callbackYes)
    setHandleNotConfirm(() => callbackNo)
    setShowConfirmDialog(true)
  }

  const [showAlertDialog, setShowAlert] = useState(false)
  const [titleMsg, setTitleMsg] = useState("")
  const [textMsg, setTextMsg] = useState("")

  const [modoAvion, setModoAvion] = useState(true)

  const showAlert = (title, text) => {
    if (text) {
      setTitleMsg(title)
      setTextMsg(text)
    } else {
      setTitleMsg("")
      setTextMsg(title)
    }
    setShowAlert(true)
  }



  const [searchResults, setSearchResults] = useState([]);
  const [textSearchProducts, setTextSearchProducts] = useState("");//variable del cuadro de busqueda
  const [buscarCodigoProducto, setBuscarCodigoProducto] = useState(false)
  const [showTecladoBuscar, setShowTecladoBuscar] = useState(false);

  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  const [userData, setUserData] = useState([]);
  const updateUserData = (data) => {
    setUserData(User.getInstance().saveInSesion(data));
  };

  const getUserData = () => {
    if (User.getInstance().sesion.hasOne())
      setUserData(User.getInstance().getFromSesion());
  };


  useEffect(() => {
    setGrandTotal(sales.getTotal());
  }, [salesData]);

  useEffect(() => {
    setSalesDataTimestamp(Date.now());
  }, [salesData, grandTotal]); // Add other dependencies as needed

  useEffect(() => {
    if (
      salesData.length == 0
      && sales.sesionProducts.hasOne()
      && sales.sesionProducts.getFirst().length > 0
    ) {
      setSalesData(sales.loadFromSesion())
    }
  }, [salesData]);

  useEffect(() => {
    if (!cliente) {
      const clientStatic = Client.getInstance()
      if (clientStatic.sesion.hasOne()) {
        setCliente(clientStatic.getFromSesion())
      }
    }
  }, [cliente]);

  const [productoSinPrecio, setProductoSinPrecio] = useState(null)
  const [showAsignarPrecio, setShowAsignarPrecio] = useState(false)
  const [showNuevoExpress, setShowNuevoExpress] = useState(false)
  const [codigoNuevoExpress, setCodigoNuevoExpress] = useState(0)

  const [showAsignarPeso, setShowAsignarPeso] = useState(false)
  const [productoSinPeso, setProductoSinPeso] = useState(null)


  const addToSalesData = (product, quantity) => {
    // console.log("")
    // console.log("")
    // console.log("")
    // console.log("")
    console.log("addToSalesData", product, "..quantity", quantity)
    if (!quantity && product.cantidad) quantity = product.cantidad

    const sePuedeVenderPrecio0 = ModelConfig.get("permitirVentaPrecio0")

    if (parseFloat(product.precioVenta) <= 0 && !sePuedeVenderPrecio0) {
      setShowAsignarPrecio(true)
      setProductoSinPrecio(product)
    } else {
      if (
        (quantity === 1 || quantity == undefined)
        && ProductSold.getInstance().esPesable(product)) {
        setShowAsignarPeso(true)
        setProductoSinPeso(product)
      } else {
        var totalAntesPrecio = sales.getTotal()
        var totalAntesCantidad = sales.getTotalCantidad()
        sales.addProduct(product, quantity);
        var totalDespuesPrecio = sales.getTotal()
        var totalDespuesCantidad = sales.getTotalCantidad()

        console.log("totalAntesPrecio", totalAntesPrecio)
        console.log("totalDespuesPrecio", totalDespuesPrecio)
        console.log("totalAntesCantidad", totalAntesCantidad)
        console.log("totalDespuesCantidad", totalDespuesCantidad)

        if (totalAntesPrecio != totalDespuesPrecio || totalAntesCantidad != totalDespuesCantidad) showMessage("Agregado correctamente")
        setGrandTotal(sales.getTotal())
        setSalesData(sales.products)

        setUltimoVuelto(null)

        UserEvent.send({
          name: "agrega producto " + product.nombre,
        })

        // setTimeout(() => {
        //   searchInputRef.current.focus()
        // }, 500);
      }
    }
  };


  const replaceToSalesData = (keyProductRemove, productPut) => {
    sales.replaceProduct(keyProductRemove, productPut);
    setSalesData(sales.products)
    setGrandTotal(sales.getTotal())
  }

  const onAsignWeight = (newPeso) => {
    addToSalesData(productoSinPeso, newPeso)
    setProductoSinPeso(null)
    setShowAsignarPeso(false)
  }

  const onAsignPrice = (newPrice) => {
    // productoSinPrecio.codigoSucursal = 0
    // productoSinPrecio.puntoVenta = "0000"
    productoSinPrecio.fechaIngreso = System.getInstance().getDateForServer()
    productoSinPrecio.precioVenta = newPrice

    Product.getInstance().assignPrice(productoSinPrecio, (response) => {
      addToSalesData(productoSinPrecio)
      setProductoSinPrecio(null)
      setShowAsignarPrecio(false)
      showMessage(response.descripcion)
    }, () => {
      showMessage("No se pudo actualizar el precio")
    })
  }

  const addNewProductFromCode = (code) => {
    if (code < 0) code = code * -1
    setCodigoNuevoExpress(code)
    setShowNuevoExpress(true)
  }

  const handleGuardarNuevoProducto = (nuevoProducto) => {
    nuevoProducto.fechaIngreso = System.getInstance().getDateForServer()
    // nuevoProducto.codigoSucursal = 0
    // nuevoProducto.puntoVenta = "0000"

    Product.getInstance().newProductFromCode(nuevoProducto, (serverInfo) => {
      console.log(serverInfo)
      nuevoProducto.idProducto = parseInt(nuevoProducto.codSacanner)
      addToSalesData(nuevoProducto)
      setCodigoNuevoExpress(0)
      setShowNuevoExpress(false)
      showMessage(serverInfo.descripcion)
    }, () => {
      showMessage("No se pudo realizar")
    })
  }

  const clearSessionData = () => {
    User.getInstance().sesion.truncate();
    setUserData([])
    setCliente(null)
    Client.getInstance().sesion.truncate();
    setUserData([])
    clearSalesData()
  };

  const clearSalesData = () => {
    setSalesData([]);
    sales.products = [];
    sales.sesionProducts.truncate()
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
    UserEvent.send({
      name: "quita producto " + sales.products[index].description,
    })
    setSalesData(sales.removeFromIndex(index));

    // setTimeout(() => {
    //   searchInputRef.current.focus()
    // }, 500);
  };


  const incrementQuantity = (index, productInfo) => {
    setSalesData(sales.incrementQuantityByIndex(index, 1));
  };

  const decrementQuantity = (index, productInfo) => {
    setSalesData(sales.decrementQuantityByIndex(index, 1));
  };

  // const suspenderVenta = async (salesData) => {
  //   sales.suspendOne(salesData,(response)=>{
  //     clearSalesData(); // Clear sales data after suspending the sale
  //     setPlu(""); // Clear the PLU code
  //     setPeso("");
  //   },()=>{

  //   })
  // };



  const GeneralElements = () => {
    return (
      <>
        <TecladoAlfaNumerico
          onEnter={() => {
            setBuscarCodigoProducto(true)

          }}
          showFlag={showTecladoBuscar}
          varChanger={setTextSearchProducts}
          varValue={textSearchProducts}
        />
        <div onClick={() => {
          setShowTecladoBuscar(false)
          setVisibleSnackbar(false)
        }}
          style={{
            width: "100%",
            height: "100%",
            display: (showTecladoBuscar ? "block" : "none"),
            // backgroundColor:"red",
            position: "fixed",

            top: 0,
            left: 0
          }}
        ></div>

        <Snackbar
  visible={visibleSnackbar}
  onDismiss={hideMessage}
  duration={3000}
  action={{
    label: "OK",
    onPress: hideMessage,
  }}
>
  {snackMessage}
</Snackbar>;

       
        <LoadingDialog openDialog={showLoadingDialog} text={loadingDialogText} />
        <AsignarPrecio
          openDialog={showAsignarPrecio}
          setOpenDialog={setShowAsignarPrecio}
          product={productoSinPrecio}
          onAsignPrice={onAsignPrice}
        />

        <AsignarPeso
          openDialog={showAsignarPeso}
          setOpenDialog={setShowAsignarPeso}
          product={productoSinPeso}
          onAsignWeight={onAsignWeight}
        />

        <NuevoProductoExpress
          openDialog={showNuevoExpress}
          setOpenDialog={setShowNuevoExpress}
          onComplete={handleGuardarNuevoProducto}
          codigoIngresado={codigoNuevoExpress}
        />

        <Confirm
          openDialog={showConfirmDialog}
          setOpenDialog={setShowConfirmDialog}
          textConfirm={textConfirm}
          handleConfirm={handleConfirm}
          handleNotConfirm={handleNotConfirm}
        />

        <PedirSupervision
          openDialog={verPedirSupervision}
          accion={accionPedirSupervision}
          infoEnviar={datosConfirmarSupervision}
          setOpenDialog={setVerPedirSupervision}
          onConfirm={() => {
            if (handleConfirmarSupervision) handleConfirmarSupervision()
          }}
        />

        <Alert
          openDialog={showAlertDialog}
          setOpenDialog={setShowAlert}
          title={titleMsg}
          message={textMsg}
        />

        <ScreenDialogBuscarCliente
          openDialog={showDialogSelectClient}
          setOpenDialog={setShowDialogSelectClient}
          setCliente={setCliente}
          askLastSale={askLastSale}
          addToSalesData={addToSalesData}
        />

      </>
    )
  }

  return (
    <SelectedOptionsContext.Provider
      value={{
        init,
        GeneralElements,
        snackMessage,
        showMessage,

        showConfirm,
        showAlert,

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

        pedirSupervision
      }}
    >
      {children}
    </SelectedOptionsContext.Provider>
  );
};

export default SelectedOptionsProvider;
