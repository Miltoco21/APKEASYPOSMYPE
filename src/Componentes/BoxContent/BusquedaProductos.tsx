import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  InteractionManager,
  Keyboard,
  BackHandler
} from 'react-native';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Product from "../../Models/Product";
import ProductList from '../ScreenContent/ProductList';
import Log from 'src/Models/Log';
import ProductCodeStack from '../../Models/ProductCodeStack';

import ModelConfig from '../../Models/ModelConfig';
import Balanza from '../../Models/Balanza';
import BalanzaUnidad from '../../Models/BalanzaUnidad';
import { Button, Icon, IconButton } from 'react-native-paper';
import CapturaCodigoCamara from '../ScreenDialog/CapturaCodigoCamara';
import IngresoPLU from 'src/Modals/IngresoPLU';
import Validator from 'src/Helpers/Validator';
import ProductSold from 'src/Models/ProductSold';
import System from 'src/Helpers/System';
import User from 'src/Models/User';




const BoxProducts = () => {
  // Acceder al contexto
  const {
    salesData,
    addToSalesData,
    removeFromSalesData,
    clearSalesData,
    salesDataTimestamp,
    showLoading,
    hideLoading,
    showMessage,
    showAlert,
    searchInputRef,
    focusSearchInput,
    tieneFocoTeclado,
    setTieneFocoTeclado,
    userData,

    apretoEnterEnBuscar,
    setApretoEnterEnBuscar,

    textSearchProducts,
    addNewProductFromCode
  } = useContext(SelectedOptionsContext);

  const procesarBusqueda = (codigoBusqueda) => {
    // console.log("procesando la busqueda", codigoBusqueda)

    var codigoCliente = 0
    // if (cliente) codigoCliente = cliente.codigoCliente
    Product.getInstance().findByCodigoBarras({
      codigoProducto: codigoBusqueda,
      codigoCliente: codigoCliente
    },
      (products, response) => {
        // console.log("Respuesta de la IdBYCODIGO:", response.data);
        // console.log("Cantidad registros:", response.data.cantidadRegistros);
        products.forEach((produ) => {
          if (parseFloat(produ.precioVenta) <= 0) {
            // console.log("el producto " + produ.nombre + ", #" + produ.idProducto + " tiene precio 0")
          }
        })

        if (response.data.cantidadRegistros > 0) {
          const productoEncontrado = products[0];
          addToSalesData(productoEncontrado);
          // setProductByCodigo(productoEncontrado);
          // setTextSearchProducts("");
          // searchInputRef.current.focus()
        } else {
          // buscarValoresBalanza(codigoBusqueda)
          addNewProductFromCode(codigoBusqueda)
          // setProductByCodigo(null);
          // setTextSearchProducts("")
        }
      },
      (error) => {
        // console.error("Error al buscar el producto:", error);
        showMessage("No se encontraron resultados para: " + codigoBusqueda);
      })
  }

  useEffect(() => {
    // System.intentarFoco(searchInputRef)
    Keyboard.addListener("keyboardDidHide", () => {
      if (User.logged) {
        setTieneFocoTeclado(false)
      }
      console.log("quitando teclado")
    })

    Keyboard.addListener("keyboardDidShow", async () => {
      if (User.logged) {
        setTieneFocoTeclado(true)
      }
      console.log("muestra teclado")
    })

    if (ProductCodeStack.processFunction) ProductCodeStack.processFunction = procesarBusqueda
  }, [])


  useEffect(() => {
    // console.log("cambio userdata", userData)
    if (userData) {
      focusSearchInput()
    }
  }, [userData])

  useEffect(() => {
    const handleBackButtonPress = () => {
      if (User.getInstance().sesion.hasOne()) {
        return true
      }
      console.log("permite ir atras")
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
    };
  }, []);

  useEffect(() => {
    // console.log("cambio textSearchProducts", textSearchProducts)
    if (searchInputRef && searchInputRef.current) {
      setSearchText(textSearchProducts)
    }
  }, [textSearchProducts])

  const [searchText, setSearchText] = useState('');


  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [capturarCodigo, setCapturarCodigo] = useState(false);


  const [showPLUModal, setShowPLUModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);

  const handlePLUConfirm = (pluValue) => {
    setShowPLUModal(false);

    if (pluValue instanceof Error) {
      showAlert('Error', pluValue.message);
      return;
    }

    ProductCodeStack.addProductCode(pluValue);
    // focusSearchInput();
  };

  const handleSearch = async (searchValue, currentPage = 1) => {
    if (!searchValue.trim() || loading) return;

    setLoading(true);
    try {
      const isNumeric = /^\d+$/.test(searchValue);
      const isCodigoBarras = isNumeric //&& (searchValue.length === 12 || searchValue.length === 13);
      let productosEncontrados = [];

      // Búsqueda exclusiva por código de barras si cumple formato
      if (isCodigoBarras) {
        ProductCodeStack.addProductCode(searchValue);
        setSearchText("")
        return;
      }

      // Resto de búsquedas solo si no es código de barras
      console.log("busca por nombre")

      productosEncontrados = await new Promise((resolve) => {
        Product.getInstance().findByDescriptionPaginado(
          {
            description: searchValue,
            codigoCliente: 0,
            pagina: currentPage,
            canPorPagina: 10
          },
          (productos) => resolve(productos || []),
          (error) => { handleError(error); resolve([]); }
        );
      });

      setFilteredProducts(productosEncontrados);
      if (productosEncontrados.length < 1) {
        showMessage("No se encontraron resultados para: " + searchText);
      }


    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setApretoEnterEnBuscar(false)
    }
  };





  const handleError = (error) => {
    console.error("Error en búsqueda:", error);
    setFilteredProducts([]);
  };


  const checkBuscar = () => {
    if (searchText.trim()) {
      handleSearch(searchText, 1);
    } else {
      setFilteredProducts([]);
      console.log("cancelamos la busqueda porque es vacio searchText ", searchText)
    }

    if (!capturarCodigo) {
      // console.log("dando foco al input buscar")

      focusSearchInput();
    }
  }

  useEffect(() => {
    // console.log("cambio searchText", searchText)
    setFilteredProducts([]);
  }, [searchText]);

  useEffect(() => {
    // console.log("cambio apretoEnterEnBuscar", apretoEnterEnBuscar)
    if (apretoEnterEnBuscar === null) return
    if (!apretoEnterEnBuscar) {
      // setApretoEnterEnBuscar(true)
      return
    }
    if (searchText) {
      checkBuscar()
    }
  }, [apretoEnterEnBuscar, searchText]);

  useEffect(() => {
    // Log("filteredProducts length", filteredProducts.length)
    if (filteredProducts.length === 1) {
      handleAddProduct(filteredProducts[0])
    }
  }, [filteredProducts]);

  const handleAddProduct = (product) => {
    addToSalesData({
      ...product,
      // cantidad: 1,
      // total: product.precioVenta * 1
    }, undefined, capturarCodigo);
  };

  useEffect(() => {
    if (capturarCodigo) {
      console.log("captura codigo..quita teclado")
      Keyboard.dismiss();
    }
  }, [capturarCodigo])

  return (
    <View>
      <CapturaCodigoCamara
        openDialog={capturarCodigo}
        setOpenDialog={setCapturarCodigo}
        // outOnCapture={false}
        onCapture={(cod) => {
          ProductCodeStack.addProductCode(cod);
        }}
      />
      <Text style={styles.headerText}>Buscar Productos</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          ref={searchInputRef}
          returnKeyType="search"

          onSubmitEditing={(e) => {
            setApretoEnterEnBuscar(!apretoEnterEnBuscar)
          }}
        />

        <TouchableOpacity style={styles.scanCodButton} onPress={() => {
          setCapturarCodigo(true)
        }}>
          <IconButton icon={"camera"}
            style={{
              width: 40,
              position: "absolute",
              top: -10,
              left: -7
            }}
          />
          <IconButton icon={"barcode"}
            style={{
              width: 40,
              position: "absolute",
              top: 7,
              left: -7
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.pluButton} onPress={() => setShowPLUModal(true)}
        >
          <Text style={styles.pluButtonText}>PLU</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="small" color="#283048" />}

      {searchText.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredProducts}
            keyExtractor={(item) => item.idProducto.toString()}
            maxToRenderPerBatch={5}
            initialNumToRender={10}
            windowSize={7}
            renderItem={({ item }) => (
              <View style={styles.productRow}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.nombre}</Text>
                  {item.idProducto && (
                    <Text style={styles.productCode}>
                      Código: {item.codigoBarras}{item.idProducto} - TipoStock: {item.tipoStock}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddProduct(item)}
                  accessibilityLabel={`Agregar ${item.nombre}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.addButtonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            )}
            // onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
          />
        </View>
      )}

      <View style={[styles.selectedBox, { maxHeight: 369 }]}>
        <Text style={styles.boxHeader}>Productos Seleccionados:</Text>
        <ProductList
          data={salesData}
          onRefresh={() => {
          }}
        />
      </View>

      <IngresoPLU
        visible={showPLUModal}
        onConfirm={handlePLUConfirm}
        onCancel={() => setShowPLUModal(false)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
    position: "absolute"
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#283048'
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16
  },
  scanCodButton: {
    borderWidth: 1,
    borderRadius: 8,
    margin: 0,
    position: "relative",
    width: 40,
    // backgroundColor:"red",
    marginLeft: 3,
    height: 50,
  },
  pluButton: {
    height: 50,
    marginLeft: 3,
    backgroundColor: '#283048',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pluButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  resultsContainer: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  productInfo: {
    flex: 1,
    marginRight: 10
  },
  productName: {
    fontSize: 16,
    color: '#333'
  },
  productCode: {
    fontSize: 12,
    color: '#666'
  },
  addButton: {
    backgroundColor: '#283048',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14
  },
  selectedBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  boxHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#283048'
  },
  noProductsText: {
    fontSize: 14,
    color: '#666'
  }
});

export default BoxProducts;

