import React, { useContext, useState, useEffect } from "react";

import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import ModelConfig from "../../Models/ModelConfig";

const BoxSelectPayMethod = ({ onChange, metodoPago, excludes = [] }) => {
  const [allExcludes, setAllExcludes] = useState([]);

  useEffect(() => {
    setAllExcludes(excludes);
    if (ModelConfig?.get && !ModelConfig.get("pagarConCuentaCorriente")) {
      setAllExcludes((prev) => [...prev, "CUENTACORRIENTE"]);
    }
  }, [excludes]); // Added dependency to ensure proper updates

  const renderButton = (label, value) => {
    if (allExcludes.includes(value)) return null;
    return (
      <TouchableOpacity
        style={[
          styles.button,
          metodoPago === value ? styles.selected : styles.unselected,
        ]}
        onPress={() => onChange(value)}
      >
        {" "}
        <Text style={styles.text}>{label}</Text>{" "}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {" "}
      {renderButton("Efectivo", "EFECTIVO")} {renderButton("Débito", "DEBITO")}{" "}
      {renderButton("Crédito", "CREDITO")}{" "}
      {renderButton("Transferencia", "TRANSFERENCIA")}{" "}
      {renderButton("Cuenta Corriente", "CUENTACORRIENTE")}{" "}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    height: 60,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 8,
  },
  selected: { backgroundColor: "#007bff" },
  unselected: {
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "white",
  },
  text: { fontSize: 16, fontWeight: "bold", color: "black" },
});

export default BoxSelectPayMethod;
