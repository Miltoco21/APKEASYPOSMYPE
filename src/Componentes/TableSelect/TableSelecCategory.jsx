import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Product from "../../Models/Product";
import SmallButton from "../Elements/SmallButton";
import Colors from "../Colores/Colores";

const TableSelecCategory = ({ show, onSelect,title="Elegir Categoría" }) => {
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    if (show) {
      Product.getInstance().getCategories(
        (respuestaServidor) => setCategories(respuestaServidor),
        () => setCategories([])
      );
    }
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => onSelect(category)}
          >
            <Text style={styles.buttonText}>{category.descripcion}</Text>
          </TouchableOpacity>

          // <SmallButton
          //         key={index}
          //         textButton={category.descripcion}
          //         actionButton={() => onSelect(category)}
          //         style={styles.button}
          //       />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {

    padding: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    
    color: "black",
  },
  categoriesContainer: {
    marginTop:22,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%",
    minHeight: 80,
    backgroundColor:Colors.azul,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default TableSelecCategory;

