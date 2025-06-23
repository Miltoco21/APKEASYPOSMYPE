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
import IngresoPrecio from 'src/Modals/IngresoPrecio';
import NewProductModal from 'src/Modals/NewProductModal';
import Validator from 'src/Helpers/Validator';
import AsignarPeso from '../ScreenDialog/AsignarPeso';
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
  } = useContext(SelectedOptionsContext);

  const procesarBusqueda = (codigoBusqueda) => {
    // console.log("procesando la busqueda", codigoBusqueda)

    var codigoCliente = 0
    // if (cliente) codigoCliente = cliente.codigoCliente
    Product.getInstance().findByCodigoBarras({
      codigoProducto: codigoBusqueda,
      codigoCliente: codigoCliente },
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
      setTieneFocoTeclado(false)
    })

    Keyboard.addListener("keyboardDidShow", async () => {
      setTieneFocoTeclado(true)
    })

    ProductCodeStack.processFunction = procesarBusqueda
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
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showNewProductModal, setShowNewProductModal] = useState(false)
  const [showWeightModal, setShowWeightModal] = useState(false);

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
        // productosEncontrados = await new Promise((resolve) => {
        //   Product.getInstance().findByCodigoBarras(
        //     { codigoProducto: searchValue, codigoCliente: 0 },
        //     (productos) => resolve(productos || []),
        //     (error) => { handleError(error); resolve([]); }
        //   );
        // });

        // Si no se encontró, mostrar modal inmediatamente
        if (productosEncontrados.length < 1) {
          setShowNewProductModal(true);
          return; // Salir tempranamente
        }
      }

      // Resto de búsquedas solo si no es código de barras
      if (!isCodigoBarras) {
        // Búsqueda por código numérico
        // if (isNumeric) {
        //   productosEncontrados = await new Promise((resolve) => {
        //     Product.getInstance().findByCodigo(
        //       { codigoProducto: searchValue, codigoCliente: 0 },
        //       (productos) => resolve(productos || []),
        //       (error) => { handleError(error); resolve([]); }
        //     );
        //   });
        // }

        // Búsqueda por descripción si no se encontró por código
        if (productosEncontrados.length < 1) {
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
        }
      }

      // Actualizar resultados
      // if (currentPage === 1) {
      setFilteredProducts(productosEncontrados);
      // } else {
      //   setFilteredProducts(prev => [...prev, ...productosEncontrados]);
      // }

      // Mostrar modal si no hay resultados en primera página
      if (productosEncontrados.length < 1) {
        setShowNewProductModal(true);
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
    // console.log("handleAddProduct handleAddProduct")
    setFilteredProducts([]);
    // console.log("poniendo '' al searchtext")
    setSearchText("");

    // 1. Primero verificar si es pesable
    const isPesable = ProductSold.getInstance().esPesable(product);


    if (isPesable) {
      setSelectedProduct(product);
      setShowWeightModal(true);
      return; // Salir después de abrir modal de peso
    }

    // 2. Luego verificar precio
    if (product.precioVenta <= 0) {
      setSelectedProduct(product);
      setShowEditPriceModal(true);
      return;
    }

    // 3. Si no es pesable y tiene precio válido, agregar
    // Keyboard.dismiss();
    addToSalesData({
      ...product,
      cantidad: 1,
      total: product.precioVenta * 1
    }, undefined, capturarCodigo);
    // console.log("poniendo '' al searchtext")
    setSearchText("");
    setFilteredProducts([])
    if (!capturarCodigo) {
      // console.log("dando foco al input buscar")
      focusSearchInput();
    }

    // console.log("limpia productos encontrados")
  };

  const handlePriceUpdate = (updatedProduct) => {
    addToSalesData(updatedProduct, undefined, capturarCodigo);
    // Actualizar lista de búsqueda si el producto está visible
    setFilteredProducts(prev => prev.map(p =>
      p.idProducto === updatedProduct.idProducto ? updatedProduct : p
    ));
    setShowEditPriceModal(false);
    // console.log("poniendo '' al searchtext")
    setSearchText("");
    // console.log("dando foco al input buscar")
    focusSearchInput();
  };


  const handleCreateProduct = (newProduct) => {
    addToSalesData({
      ...newProduct,
      quantity: 1,
      total: newProduct.price || 0
    }, undefined, capturarCodigo);
    showAlert('Éxito', 'Producto creado y agregado');
    setShowNewProductModal(false);
  };

  useEffect(() => {
    if (capturarCodigo) {
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

      <NewProductModal
        visible={showNewProductModal}
        pluCode={searchText}
        onSave={handleCreateProduct}
        onCancel={() => setShowNewProductModal(false)}
        confirmation={true}
        confirmationMessage="Producto no encontrado. ¿Desea agregarlo?"
      />

      <IngresoPrecio
        visible={showEditPriceModal}
        product={selectedProduct}
        onConfirm={handlePriceUpdate}
        onCancel={() => {
          setShowEditPriceModal(false);
          setSelectedProduct(null);
        }}
      />
      <AsignarPeso
        visible={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        product={selectedProduct}
        currentWeight={selectedProduct?.cantidad || 0}
        onSave={(peso) => {
          const updatedProduct = {
            ...selectedProduct,
            cantidad: peso,
            total: selectedProduct.precioVenta * peso
          };
          addToSalesData(updatedProduct, undefined, true);
          setShowWeightModal(false);
          // console.log("poniendo '' al searchtext")
          setSearchText("");
          // console.log("dando foco al input buscar")
          if (!capturarCodigo) {
            focusSearchInput();
          }
        }}
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

