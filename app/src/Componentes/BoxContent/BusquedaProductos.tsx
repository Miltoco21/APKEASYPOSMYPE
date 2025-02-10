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
import Product from "../Models/Product";
import Ionicons from "@expo/vector-icons/Ionicons"
const BoxProducts = () => {
  //const { codigoCliente } = useContext(SelectedOptionsContext);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

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
  ////Manejo de agregar borrar y limpiar todo
  const handleAddProduct = (product) => {
    if (!selectedProducts.some(p => p.idProducto === product.idProducto)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  }; const handleDeleteProduct = (product) => {
    setSelectedProducts(prev => prev.filter(p => p.idProducto !== product.idProducto));
  };

  const handleClearAllProducts = () => {
    setSelectedProducts([]);
  };

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
                    <Text style={styles.productCode}>Código: {item.codigoBarras}{item.idProducto}
                      TipoStock{item.tipoStock}
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

      <View style={styles.selectedBox}>
        <Text style={styles.boxHeader}>Productos Seleccionados:</Text>
        {selectedProducts.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={() => setClearAllModalVisible(true)}
          >
            <Ionicons name="trash-bin" size={24} color="#661174" />
          </TouchableOpacity>
        )}

        {selectedProducts.length === 0 ? (
          <Text style={styles.noProductsText}>No hay productos agregados.</Text>
        ) : (
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.idProducto.toString()}
            renderItem={({ item }) => (
              <View style={styles.selectedProductRow}>
                <Text style={styles.selectedProductText}>{item.nombre}</Text>
                {item.precioVenta && (
                  <Text style={styles.productPrice}>${item.precioVenta}</Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedProductToDelete(item);
                    setDeleteModalVisible(true);
                  }}
                >
                  <Ionicons name="trash" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

// Estilos actualizados para mejor visualización
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
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
  productName: {
    fontSize: 16,
    color: '#333',
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

    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedProductText: {
    fontSize: 16,
    color: '#333',
  },
  clearAllButton: {
    padding: 5,

  },
  productPrice: { fontSize: 14, color: '#283048', fontWeight: 'bold' },
  productCode: { fontSize: 12, color: '#666' },
  productInfo: { flex: 1, marginRight: 10 },
});

export default BoxProducts;
