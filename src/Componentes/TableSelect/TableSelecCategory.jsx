import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import SmallButton from "../Elements/SmallButton";
import Product from "../../Models/Product";

const TableSelecCategory = ({ show, onSelect, title = "Elegir categoria" }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories([]);
    Product.getInstance().getCategories(
      (respuestaServidor) => {
        setCategories(respuestaServidor);
      },
      () => {
        setCategories([]);
      }
    );
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {categories.length > 0 &&
        categories.map((category, index) => (
          <SmallButton
            key={index}
            textButton={category.descripcion}
            actionButton={() => onSelect(category)}
            style={styles.button}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    minHeight: 80,
    marginBottom: 10,
  },
});

export default TableSelecCategory;
