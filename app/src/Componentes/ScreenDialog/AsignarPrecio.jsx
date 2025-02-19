import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Dialog, Portal, Button, Text, TextInput } from "react-native-paper";
import TecladoPrecio from "../Teclados/TecladoPrecio";

const AsignarPrecio = ({
  openDialog,
  setOpenDialog,
  product,
  onAsignPrice
}) => {
  const [precioVenta, setPrecioVenta] = useState(0);

  const checkPrecioVenta = (precio) => {
    if (typeof precio === "string") {
      setPrecioVenta(parseFloat(precio) || 0);
    }
  };

  const handlerSaveAction = () => {
    if (precioVenta === 0) {
      alert("Debe ingresar un monto inicial");
      return;
    }
    onAsignPrice(precioVenta);
    setOpenDialog(false);
  };

  return (
    <Modal
      visible={openDialog}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOpenDialog(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text>Asignar Precio</Text>
          <Text style={styles.text}>
            Ingrese el monto del producto {product ? product.nombre : ""}
          </Text>
          <TextInput
            label="Monto del ingreso"
            mode="outlined"
            keyboardType="numeric"
            value={precioVenta.toString()}
            onChangeText={checkPrecioVenta}
            style={styles.input}
          />
          {/* <TecladoPrecio
          maxValue={100000}
          showFlag={true}
          varValue={precioVenta}
          varChanger={checkPrecioVenta}
          onEnter={handlerSaveAction}
        /> */}
          <Button mode="contained" onPress={handlerSaveAction}>
            Confirmar
          </Button>
          <Button onPress={() => setOpenDialog(false)}>No agregar</Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%"
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },

  text: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default AsignarPrecio;
