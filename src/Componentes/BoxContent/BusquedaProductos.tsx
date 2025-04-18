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
  Keyboard
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
    focusSearchInput

  } = useContext(SelectedOptionsContext);

  const refInputBuscar = useRef(null)

  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [capturarCodigo, setCapturarCodigo] = useState(false);


  const [showPLUModal, setShowPLUModal] = useState(false);

  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePLUConfirm = (pluValue) => {
    setShowPLUModal(false);

    if (pluValue instanceof Error) {
      showAlert('Error', pluValue.message);
      return;
    }

    ProductCodeStack.addProductCode(pluValue);
    setSearchText("");
  };


  // Resto del código de búsqueda permanece igual...
  const handleSearch = async (searchValue, currentPage = 1) => {
    if (!searchValue.trim() || loading) return;

    setLoading(true);
    try {
      const isNumeric = /^\d+$/.test(searchValue);
      const isCodigoBarras = isNumeric && (searchValue.length === 12 || searchValue.length === 13);

      if (isCodigoBarras) {
        // Priorizar búsqueda por código de barras primero
        await Product.getInstance().findByCodigoBarras(
          { codigoProducto: searchValue, codigoCliente: 0 },
          (productosBarras) => {
            if (productosBarras?.length > 0) {
              setFilteredProducts(productosBarras);
              setHasMore(false);
            } else {
              // Si no encuentra por código de barras, probar con código normal
              searchByCodigoProducto(searchValue);
            }
          },
          handleError
        );
      } else if (isNumeric) {
        // Búsqueda numérica que no cumple formato de código de barras
        searchByCodigoProducto(searchValue);
      } else {
        // Búsqueda por descripción
        searchByDescription(searchValue, currentPage);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para búsqueda por código de producto
  const searchByCodigoProducto = async (codigo) => {
    await Product.getInstance().findByCodigo(
      { codigoProducto: codigo, codigoCliente: 0 },
      (productos) => {
        if (productos?.length > 0) {
          setFilteredProducts(productos);
          setHasMore(false);
        } else {
          // Si no encuentra por código, intentar como descripción numérica
          searchByDescription(codigo, 1);
        }
      },
      handleError
    );
  };
  const searchByDescription = async (searchValue, currentPage) => {
    console.log("searchByDescription")
    // showLoading("Buscando por descripcion")
    await Product.getInstance().findByDescriptionPaginado(
      {
        description: searchValue,
        codigoCliente: 0,
        pagina: currentPage,
        canPorPagina: 10
      },
      (productos, response) => {
        Log("resultado de la busqueda", productos)
        console.log("currentPage", currentPage)
        if (currentPage === 1) {
          setFilteredProducts(productos || []);
        } else {
          setFilteredProducts(prev => [...prev, ...(productos || [])]);
        }
        setHasMore(productos?.length === 10);

        // hideLoading()
        // refInputBuscar.current.blur()
        // setTimeout(() => {
        //   refInputBuscar.current.focus()
        // }, 500);

      }, (err) => {
        // hideLoading()
        handleError(err)
      }
    );
  };

  const handleError = (error) => {
    console.error("Error en búsqueda:", error);
    setFilteredProducts([]);
    setHasMore(false);
  };

  const handlePLUSearch = () => {
    // Si el texto ingresado es numérico, se procesa como código PLU
    if (!parseFloat(searchText)) return;
    ProductCodeStack.addProductCode(searchText);
    setSearchText('');
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchText.trim()) {
        setPage(1);
        handleSearch(searchText, 1);
      } else {
        setFilteredProducts([]);
        setHasMore(true);
      }
    }, 500);

    focusSearchInput();

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  const loadMoreProducts = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      handleSearch(searchText, page + 1);
    }
  };

  // const handleAddProduct = (product) => {
  //   Keyboard.dismiss(); // Cierra el teclado
  //   addToSalesData(product);
  //   setSearchText("");
  //   //Keyboard.dismiss(); // Cierra el teclado
  //  focusSearchInput();

  // };
  const handleAddProduct = (product) => {
    if (product.precioVenta <= 0) {
      // Si el precio es cero, mostrar modal de edición
      setSelectedProduct(product);
      setShowEditPriceModal(true);
    } else {
      // Si el precio es válido, agregar directamente
      Keyboard.dismiss();
      addToSalesData(product);
      setSearchText("");
      focusSearchInput();
    }
  };
    // Función para manejar la actualización del precio

  const handlePriceUpdate = (updatedProduct) => {
    addToSalesData(updatedProduct);
     // Actualizar lista de búsqueda si el producto está visible
  setFilteredProducts(prev => prev.map(p => 
    p.idProducto === updatedProduct.idProducto ? updatedProduct : p
  ));
    setShowEditPriceModal(false);
    setSearchText("");
    focusSearchInput();
  };




  return (
    <View>
      <CapturaCodigoCamara
        openDialog={capturarCodigo}
        setOpenDialog={setCapturarCodigo}
        onCapture={(cod) => {
          setSearchText(cod)
          focusSearchInput();

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
        <TouchableOpacity style={styles.pluButton}   onPress={() => setShowPLUModal(true)}
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
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
          />
        </View>
      )}

      <View style={[styles.selectedBox, { maxHeight: 369 }]}>
        <Text style={styles.boxHeader}>Productos Seleccionados:</Text>
        {salesData.length === 0 ? (
          <Text style={styles.noProductsText}>No hay productos agregados.</Text>
        ) : (
          <ProductList
            data={salesData}
            onRefresh={() => {

            }}
          />
        )}
      </View>

      <IngresoPLU
        visible={showPLUModal}
        // onConfirm={handlePLUConfirm}
        onConfirm={(plu) => {
          // Lógica para manejar PLU válido
          console.log('PLU ingresado:', plu);
          setShowPLUModal(false);
        }}
        onCancel={() => setShowPLUModal(false)}
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

    </View>

  );



};

// // Estilos permanecen iguales...
// // Estilos actualizados para mejor visualización
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

