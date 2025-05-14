

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Validator from "../../Helpers/Validator";

const AsignarPeso = ({ visible, onClose, product, currentWeight, onSave }) => {
  const [peso, setPeso] = useState(currentWeight.toString());

  useEffect(() => {
    setPeso(currentWeight.toString());
  }, [currentWeight]);

  const handleInputChange = (text) => {
    // Validar entrada con máximo un punto decimal
    const cleanedText = text
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');
    
    setPeso(cleanedText);
  };

  const handleSave = () => {
    if (peso === "" || peso === ".") {
      alert("Peso inválido");
      return;
    }
    
    const numericValue = parseFloat(peso);
    
    if (isNaN(numericValue)) {
      alert("Peso inválido");
      return;
    }
    
    onSave(numericValue);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Asignar Peso - {product?.nombre}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={peso}
              onChangeText={handleInputChange}
              placeholder="0.0"
              autoFocus={true}
              selectTextOnFocus={true}
            />
            <Text style={styles.unitText}>kg</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio unitario:</Text>
            <Text style={styles.priceValue}>
              ${product?.precioVenta?.toFixed(2)}
            </Text>

            <Text style={styles.totalLabel}>Total a pagar:</Text>
            <Text style={styles.totalValue}>
              ${(product?.precioVenta * parseFloat(peso || 0)).toFixed(2)}
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  input: {
    fontSize: 32,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#2ecc71",
    padding: 10,
    minWidth: 120,
    textAlign: "center",
  },
  unitText: {
    fontSize: 24,
    marginLeft: 10,
    color: "#666",
  },
  priceContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AsignarPeso;