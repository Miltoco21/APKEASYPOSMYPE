import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
  Keyboard,
} from "react-native";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SystemHelper from "../../Helpers/System";
import Product from "../../Models/Product";
import Validator from "../../Helpers/Validator";
import { Snackbar } from "react-native-paper";

const TableSelectProduct = ({ show, onSelect, title = "Buscar producto" }) => {
  const {
    cliente,

    showSnackbarMessage,
  } = useContext(SelectedOptionsContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    handleDescripcionSearchButtonClick();
  }, [searchTerm]);
  const handleDescripcionSearchButtonClick = async () => {
    if (parseFloat(searchTerm) || searchTerm.trim() == "") return;

    var codigoCliente = 0;
    if (cliente) codigoCliente = cliente.codigoCliente;

    Product.getInstance().findByDescriptionPaginado(
      { description: searchTerm, codigoCliente: codigoCliente },
      (products, response) => {
        if (response.data.cantidadRegistros > 0) {
          setProducts(products);
        } else {
          console.log("Producto no encontrado.");
          setProducts([]);
          showSnackbarMessage("Descripción o producto no encontrado");
        }
        setProducts(products);
      },
      () => {
        setProducts([]);
      }
    );
  };

  const handlePluSearch = async () => {
    if (!parseFloat(searchTerm)) return;

    const codigoCliente = cliente ? cliente.codigoCliente : 0;
    Product.getInstance().findByCodigo(
      { codigoProducto: searchTerm, codigoCliente },
      (products, response) => {
        if (response.data.cantidadRegistros > 0) {
          setProducts(products);
        } else {
          showSnackbarMessage("Producto no encontrado.");
        }
      },
      (error) => {
        showSnackbarMessage("No se encontraron resultados para: " + searchTerm);
      }
    );
  };

  const handleDescripcionSearch = async () => {
    if (parseFloat(searchTerm) || searchTerm.trim() === "") return;

    const codigoCliente = cliente ? cliente.codigoCliente : 0;
    Product.getInstance().findByDescriptionPaginado(
      { description: searchTerm, codigoCliente },
      (products, response) => {
        setProducts(response.data.cantidadRegistros > 0 ? products : []);
      },
      () => {
        setProducts([]);
      }
    );
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      showSnackbarMessage("Ingrese un valor para buscar");
      return;
    }
    console.log("handleSearch ocultando teclado")
    Keyboard.dismiss();
    parseFloat(searchTerm) ? handlePluSearch() : handleDescripcionSearch();
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productRow}>
      <View style={styles.productCell}>
        <Text>{item.nombre}</Text>
      </View>
      <View style={styles.productCell}>
        <Text>Pluuu: {item.idProducto}</Text>
      </View>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => onSelect(item)}
      >
        <Text style={styles.buttonText}>Seleccionar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { display: show ? "flex" : "none" }]}>
      <Modal visible={dialogVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ingrese descripción</Text>
          <TextInput
            style={styles.modalInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => setDialogVisible(false)}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setDialogVisible(false)}
          >
            <Text>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.pluButton} onPress={handleSearch}>
          <Text style={styles.pluButtonText}>PLU</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tableContainer}>
        <Text style={styles.title}>{title}</Text>
        {products.length > 0 ? (
          products.map((product, index) => (
            <TouchableOpacity
              key={`${product.idProducto}-${index}`}
              style={styles.productItem}
              onPress={() => onSelect(product)}
            >
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.nombre}</Text>
                <Text style={styles.productPlu}>PLU: {product.idProducto}</Text>
              </View>
              <View style={styles.selectButton}>
                <Text style={styles.buttonText}>Seleccionar</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No se encontraron productos</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#859398",
    padding: 10,

    width: "100%",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minHeight: 400,
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
   
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  pluButton: {
    backgroundColor: "#283048",
    padding: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  pluButtonText: {
    color: "white",
  },
  tableContainer: {
    maxHeight: 300,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  productCell: {
    flex: 1,
    justifyContent: "center",
  },
  selectButton: {
    backgroundColor: "#283048",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 16,
    color: "#666",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
  },
  modalButton: {
    padding: 15,
    backgroundColor: "#ddd",
    alignItems: "center",
    borderRadius: 4,
  },
});

export default TableSelectProduct;
