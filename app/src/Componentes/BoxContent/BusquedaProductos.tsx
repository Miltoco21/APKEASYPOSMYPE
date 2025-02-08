
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   FlatList,

// } from 'react-native';
// import SelectedOptionsProvider, { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
// import Product from "../Models/Product"
// // Datos dummy de productos
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Box from '../Box';

// const BoxProducts = () => {

//   const {

//   } = useContext(SelectedOptionsContext);

//   const codigoCliente = 0

//   const [searchText, setSearchText] = useState('');
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   // Filtrar productos según el texto de búsqueda
//   useEffect(() => {
//     const searchDebounce = setTimeout(() => {
//       if (searchText.trim()) {
//         Product.getInstance().findByDescription(
//           {
//             description: searchText,
//             codigoCliente: codigoCliente
//           },
//           (productos) => {
//             setFilteredProducts(productos || []); 
//             console.log(productos)
//           },
         
//           (error) => {
//             console.error("Error buscando productos:", error);
//             setFilteredProducts([]);
//           }
//         );
//       } else {
//         setFilteredProducts([]);
//       }
//     }, 500);

//     return () => clearTimeout(searchDebounce);
//   }, [searchText, codigoCliente]);

//   // Agregar un producto a la lista de seleccionados (evitando duplicados)

//   const handleAddProduct = (product) => {
//     if (!selectedProducts.some(p => p.idProducto === product.idProducto)) {
//       setSelectedProducts([...selectedProducts, product]);
//     }
//   };

//   return (
//     <SafeAreaView >
//       <TextInput

//         placeholder="Buscar..."
//         placeholderTextColor="#999"
//         value={searchText}
//         onChangeText={setSearchText}
//       />


//       {filteredProducts && filteredProducts.length > 0 ? (
//         <View>
//           <FlatList
           
//             data={filteredProducts}
//             keyboardShouldPersistTaps="handled" 
//             keyExtractor={(item) => item.idProducto.toString()}
//             renderItem={({ item }) => (
//               <View >
//                 <Text >{item.nombre}</Text>
//                 <TouchableOpacity

//                   onPress={() => handleAddProduct(item)}
//                 >
//                   <Text >Agregar</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           />

//         </View>
//       ) : null}

//       <View >

//         <Text >Productos Seleccionados:</Text>
//         {selectedProducts.length === 0 ? (
//           <Text >
//             No hay productos agregados.
//           </Text>
//         ) : (
//           <FlatList
//             data={selectedProducts}
//             keyExtractor={(item) => item.idProducto.toString()}
//             keyboardShouldPersistTaps="handled" 
//             renderItem={({ item }) => (
//               <View >
//                 <Text >{item.description}</Text>
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };


// export default BoxProducts;

// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
// } from "react-native";
// import { Stack } from "expo-router";
// // Si usas Box, y sospechas que puede causar problemas, prueba comentarlo temporalmente.
// // import Box from "../Box";
// import Product from "../Models/Product";
// import SelectedOptionsProvider, { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// const BoxProducts = () => {
//   // Usar el contexto si lo requieres
//   const {} = useContext(SelectedOptionsContext);

//   const codigoCliente = 0;
//   const [searchText, setSearchText] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   // Búsqueda con debounce
//   useEffect(() => {
//     const searchDebounce = setTimeout(() => {
//       if (searchText.trim()) {
//         Product.getInstance().findByDescription(
//           {
//             description: searchText,
//             codigoCliente,
//           },
//           (productos) => {
//             console.log("Productos encontrados:", productos);
//             setFilteredProducts(productos || []);
//           },
//           (error) => {
//             console.error("Error buscando productos:", error);
//             setFilteredProducts([]);
//           }
//         );
//       } else {
//         setFilteredProducts([]);
//       }
//     }, 500);

//     return () => clearTimeout(searchDebounce);
//   }, [searchText, codigoCliente]);

//   const handleAddProduct = (product) => {
//     if (!selectedProducts.some((p) => p.idProducto === product.idProducto)) {
//       setSelectedProducts([...selectedProducts, product]);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <TextInput
//           style={styles.input}
//           placeholder="Buscar..."
//           placeholderTextColor="#999"
//           value={searchText}
//           onChangeText={setSearchText}
//         />

//         {/* Lista de productos filtrados */}
//         {filteredProducts && filteredProducts.length > 0 && (
//           // Si sospechas que Box causa el problema, prueba usar View directamente.
//           // <Box style={styles.resultsContainer}>
//           <View style={styles.resultsContainer}>
//             <FlatList
//               data={filteredProducts}
//               keyboardShouldPersistTaps="handled"
//               keyExtractor={(item) => item.idProducto.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.itemContainer}>
//                   <Text style={styles.itemText}>{item.nombre}</Text>
//                   <TouchableOpacity onPress={() => handleAddProduct(item)}>
//                     <Text style={styles.addButton}>Agregar</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             />
//           </View>
//           // </Box>
//         )}

//         {/* Lista de productos seleccionados */}
//         <View style={styles.selectedContainer}>
//           <Text style={styles.selectedTitle}>Productos Seleccionados:</Text>
//           {selectedProducts.length === 0 ? (
//             <Text>No hay productos agregados.</Text>
//           ) : (
//             <FlatList
//               data={selectedProducts}
//               keyboardShouldPersistTaps="handled"
//               keyExtractor={(item) => item.idProducto.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.itemContainer}>
//                   <Text style={styles.itemText}>{item.description}</Text>
//                 </View>
//               )}
//             />
//           )}
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     marginBottom: 16,
//     borderRadius: 4,
//   },
//   resultsContainer: {
//     flex: 1, // Ajusta el tamaño para que la FlatList tenga espacio
//     marginBottom: 16,
//   },
//   itemContainer: {
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   itemText: {
//     fontSize: 16,
//   },
//   addButton: {
//     color: "#007BFF",
//   },
//   selectedContainer: {
//     flex: 1,
//   },
//   selectedTitle: {
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
// });

// export default BoxProducts;
// // BoxProducts.jsx
// import React, { useState, useEffect,useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import SelectedOptionsProvider, { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
// import Product from "../../Models/Product"
// // Datos dummy de productos


// const BoxProducts = () => {

//   const {

//   } = useContext(SelectedOptionsContext);

//   const codigoCliente=0

//   const [searchText, setSearchText] = useState('');
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   // Filtrar productos según el texto de búsqueda
//   useEffect(() => {
//     const searchDebounce = setTimeout(() => {
//       if (searchText.trim()) {
//         Product.getInstance().findByDescription(
//           {
//             description: searchText,
//             codigoCliente: codigoCliente
//           },
//           (productos) => {
//             setFilteredProducts(productos || []);
//           },
//           (error) => {
//             console.error("Error buscando productos:", error);
//             setFilteredProducts([]);
//           }
//         );
//       } else {
//         setFilteredProducts([]);
//       }
//     }, 500);

//     return () => clearTimeout(searchDebounce);
//   }, [searchText, codigoCliente]);

//   // Agregar un producto a la lista de seleccionados (evitando duplicados)

//   const handleAddProduct = (product) => {
//     if (!selectedProducts.some(p => p.idProducto === product.idProducto)) {
//       setSelectedProducts([...selectedProducts, product]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Buscar Productos</Text>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Buscar..."
//         placeholderTextColor="#999"
//         value={searchText}
//         onChangeText={setSearchText}
//       />


//       {searchText.length > 0 ? (
//         <View style={styles.resultsContainer}>
//          <FlatList
//   data={filteredProducts}
//   keyExtractor={(item) => item.idProducto.toString()}
//   renderItem={({ item }) => (
//     <View style={styles.productRow}>
//       <Text style={styles.productName}>{item.nombre}</Text>
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => handleAddProduct(item)}
//       >
//         <Text style={styles.addButtonText}>Agregar</Text>
//       </TouchableOpacity>
//     </View>
//   )}
// />
//         </View>
//       ) : null}

//       <View style={styles.selectedBox}>

//         <Text style={styles.boxHeader}>Productos Seleccionados:</Text>
//         {selectedProducts.length === 0 ? (
//           <Text style={styles.noProductsText}>
//             No hay productos agregados.
//           </Text>
//         ) : (
//           <FlatList
//           data={selectedProducts}
//           keyExtractor={(item) => item.idProducto.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.selectedProductRow}>
//               <Text style={styles.selectedProductText}>{item.description}</Text>
//             </View>
//           )}
//         />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     flex: 1,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#283048',
//   },
//   searchInput: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 16,
//     backgroundColor: '#fff',
//     color: '#000',
//   },
//   resultsContainer: {
//     maxHeight: 200,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   productRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   productName: {
//     fontSize: 16,
//     color: '#333',
//   },
//   addButton: {
//     backgroundColor: '#283048',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   selectedBox: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   boxHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#283048',
//   },
//   noProductsText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   selectedProductRow: {
//     paddingVertical: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   selectedProductText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default BoxProducts;
// BoxProducts.jsx
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

const BoxProducts = () => {
  const { codigoCliente } = useContext(SelectedOptionsContext);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


const handleSearch = async (searchValue, currentPage = 1) => {
    if (!searchValue.trim() || loading) return;

    setLoading(true);
    try {
        const isNumeric = /^\d+$/.test(searchValue);
        const isCodigoBarras = isNumeric && (searchValue.length === 12 || searchValue.length === 13);
        
        if (isCodigoBarras) {
            // Priorizar búsqueda por código de barras primero
            await Product.getInstance().findByCodigoBarras(
                { codigoProducto: searchValue, codigoCliente },
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
        { codigoProducto: codigo, codigoCliente },
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
};  // const handleSearch = async (searchValue, currentPage = 1) => {
  //   if (!searchValue.trim() || loading) return;

  //   setLoading(true);
  //   try {
  //     // Búsqueda por código numérico
  //     if (/^\d+$/.test(searchValue)) {
  //       // Intentar primero por código de producto
  //       await Product.getInstance().findByCodigo(
  //         { codigoProducto: searchValue, codigoCliente },
  //         (productos) => {
  //           if (productos?.length > 0) {
  //             setFilteredProducts(productos);
  //             setHasMore(false);
  //           } else {
  //             // Si no encuentra por código, intentar por código de barras
  //             Product.getInstance().findByCodigoBarras(
  //               { codigoProducto: searchValue, codigoCliente },
  //               (productosBarras) => {
  //                 if (productosBarras?.length > 0) {
  //                   setFilteredProducts(productosBarras);
  //                   setHasMore(false);
  //                 } else {
  //                   // Si no encuentra, hacer búsqueda normal
  //                   searchByDescription(searchValue, currentPage);
  //                 }
  //               },
  //               handleError
  //             );
  //           }
  //         },
  //         handleError
  //       );
  //     } else {
  //       // Búsqueda por descripción
  //       searchByDescription(searchValue, currentPage);
  //     }
  //   } catch (error) {
  //     handleError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const searchByDescription = (searchValue, currentPage) => {
    Product.getInstance().findByDescriptionPaginado(
      {
        description: searchValue,
        codigoCliente,
        pagina: currentPage,
        canPorPagina: 10
      },
      (productos, response) => {
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

  const handleAddProduct = (product) => {
    if (!selectedProducts.some(p => p.idProducto === product.idProducto)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Buscar Productos</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por código, código de barras o descripción..."
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
                  {item.codigoBarras && (
                    <Text style={styles.productCode}>Código: {item.codigoBarras}{item.idProducto}
                    
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
  productPrice: { fontSize: 14, color: '#283048', fontWeight: 'bold' }, 
  productCode: { fontSize: 12, color: '#666' }, 
  productInfo: { flex: 1, marginRight: 10 },
});

export default BoxProducts;