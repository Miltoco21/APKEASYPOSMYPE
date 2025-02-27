import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import ProductSold from "../../Models/ProductSold";
import Validator from "../../Helpers/Validator";
import { SafeAreaView } from "react-native-safe-area-context";

const BoxEntregaEnvases = ({
  tieneEnvases,
  settieneEnvases,
  products,
  productosConEnvases,
  setProductosConEnvases,
  descuentoEnvases,
  setDescuentoEnvases,
}) => {
  useEffect(() => {
    if (products.length < 1) return;
    checkEnvases();
  }, [products]);

  const updateDescuentosEnvases = (productos) => {
    let descuentos = productos.reduce((acc, pro) => (pro.isEnvase ? acc + pro.total : acc), 0);
    setDescuentoEnvases(descuentos);
  };

  const checkEnvases = () => {
    let tieneAlguno = products.some((pro) => pro.isEnvase);
    let descuentosDeEnvases = products.reduce((acc, pro) => (pro.isEnvase ? acc + pro.total : acc), 0);

    settieneEnvases(tieneAlguno);
    setProductosConEnvases([...products]);
    setDescuentoEnvases(descuentosDeEnvases);
  };

  const changeQuantityIfEnvase = (prod, index, newQuantity) => {
    if (!prod.isEnvase || newQuantity < 0 || !Validator.isCantidad(newQuantity)) return;

    const orig = ProductSold.getOwnerByEnvase(prod, productosConEnvases);
    if (newQuantity > orig.quantity) return;

    const updatedProds = [...productosConEnvases];
    updatedProds[index].quantity = newQuantity;
    updatedProds[index].total = newQuantity * orig.total / orig.quantity;

    setProductosConEnvases(updatedProds);
    updateDescuentosEnvases(updatedProds);
  };

  return (
    <SafeAreaView style={styles.container}>
      {tieneEnvases && <Text style={styles.header}>Envases que entrega el cliente</Text>}
      <FlatList
        data={productosConEnvases.filter((prod) => prod.isEnvase)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.row, { backgroundColor: index % 2 === 0 ? "#f3f3f3" : "#dfdfdf" }]}>            
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => changeQuantityIfEnvase(item, index, item.quantity - 1)} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeQuantityIfEnvase(item, index, item.quantity + 1)} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.total}>${System.getInstance().en2Decimales(item.total)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  quantity: {
    width: 50,
    height: 50,
    textAlign: "center",
    textAlignVertical: "center",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: "#6c6ce7",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  description: {
    flex: 1,
    marginLeft: 10,
  },
  total: {
    fontWeight: "bold",
  },
});

export default BoxEntregaEnvases;