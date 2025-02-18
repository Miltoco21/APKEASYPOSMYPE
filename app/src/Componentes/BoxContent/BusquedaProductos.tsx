

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Product from "../../Models/Product";
import Ionicons from "@expo/vector-icons/Ionicons"
import Confirm from '../Dialogs/Confirm';
import ProductList from '../ScreenContent/ProductList';

const BoxProducts = () => {
  // Acceder al contexto
  const {
    salesData,
    addToSalesData,
    removeFromSalesData,
    clearSalesData,
    salesDataTimestamp
  } = useContext(SelectedOptionsContext);

  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

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
    Product.getInstance().findByDescriptionPaginado(
      {
        description: searchValue,
        codigoCliente: 0,
        pagina: currentPage,
        canPorPagina: 10
      },
      (productos, response) => {
        console.log("resultado de la busqueda", productos)
        console.log("currentPage", currentPage)
        if (currentPage === 1) {
          setFilteredProducts(productos || []);
        } else {
          setFilteredProducts(prev => [...prev, ...(productos || [])]);
        }
        setHasMore(productos?.length === 10);
      },
      handleError
    );
  };

  const handleError = (error) => {
    console.error("Error en búsqueda:", error);
    setFilteredProducts([]);
    setHasMore(false);
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

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  const loadMoreProducts = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      handleSearch(searchText, page + 1);
    }
  };
  // Manejo de productos seleccionados usando contexto
  const handleAddProduct = (product) => {
    addToSalesData(product);

  };

  const handleDeleteProduct = (index) => {
    removeFromSalesData(index);
  };

  const handleClearAllProducts = () => {
    clearSalesData();
  };

  console.log("salesData",salesData);
  
  return (
    <View>
      <Text style={styles.headerText}>Buscar Productos</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading && <ActivityIndicator size="small" color="#283048" />}

      {searchText.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.idProducto.toString()}
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
            onDeleteProduct={setSelectedProductToDelete}
            onShowDeleteModal={setDeleteModalVisible}
            
          />
        )}
      </View>
      {/* <View style={[styles.selectedBox, { maxHeight: 369 }]}>
        <Text style={styles.boxHeader}>Productos Seleccionados:</Text>
        {salesData.length === 0 ? (
          <Text style={styles.noProductsText}>No hay productos agregados.</Text>
        ) : (
          <FlatList
            data={salesData}
            keyExtractor={(item, index) => `${item.idProducto}_${index}`}
            extraData={salesDataTimestamp}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item, index }) => (
              <View style={styles.selectedProductRow}>
                <Text style={styles.quantityText}>{item.cantidad}</Text>
                <Text style={styles.selectedProductText}>{item.nombre}</Text>
                <Text style={styles.priceText}>
                  {item.precioVenta ? `$${item.precioVenta}` : '-'}
                </Text>
                <Text style={styles.totalText}>
                  {item.precioVenta ? `$${(item.precioVenta * item.cantidad)}` : '-'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedProductToDelete(index);
                    setDeleteModalVisible(true);
                  }}
                >
                  <Ionicons name="trash" size={21} color="#ff4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View> */}

      {/* Modales de confirmación */}
      <Confirm
        visible={deleteModalVisible}
        text="¿Eliminar este producto?"
        onConfirm={() => {
          handleDeleteProduct(selectedProductToDelete);
          setDeleteModalVisible(false);
        }}
        onCancel={() => setDeleteModalVisible(false)}
      />

      <Confirm
        visible={clearAllModalVisible}
        text="¿Eliminar todos los productos?"
        onConfirm={() => {
          handleClearAllProducts();
          setClearAllModalVisible(false);
        }}
        onCancel={() => setClearAllModalVisible(false)}
      />
    </View>
  );

};

// // Estilos permanecen iguales...
// // Estilos actualizados para mejor visualización
const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#283048',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  resultsContainer: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    color: '#333',
  },
  productCode: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#283048',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  boxHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#283048',
  },
  noProductsText: {
    fontSize: 14,
    color: '#666',
  },
  selectedProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityText: {
    flex: 0.5,
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedProductText: {
    flex: 2,
    fontSize: 8,
    color: '#333',
    paddingHorizontal: 4,
  },
  priceText: {
    flex: 1,
    fontSize: 9,
    color: '#283048',
    textAlign: 'right',
    paddingHorizontal: 4,
  },
  totalText: {
    flex: 1,
    fontSize: 9,
    color: '#283048',
    fontWeight: 'bold',
    textAlign: 'right',
    paddingHorizontal: 4,
  },
});
export default BoxProducts;


//[cantidad][nombre][precioVenta][total][boton eliminar]