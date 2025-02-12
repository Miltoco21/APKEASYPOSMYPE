import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog, Portal, Button, Text, TextInput } from "react-native-paper";
import TecladoPrecio from "../Teclados/TecladoPrecio";

const AsignarPrecio = ({ openDialog, setOpenDialog, product, onAsignPrice }) => {
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
    <Portal>
      <Dialog visible={openDialog} onDismiss={() => setOpenDialog(false)}>
        <Dialog.Title>Asignar Precio</Dialog.Title>
        <Dialog.Content>
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
          <TecladoPrecio
            maxValue={100000}
            showFlag={true}
            varValue={precioVenta}
            varChanger={checkPrecioVenta}
            onEnter={handlerSaveAction}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={handlerSaveAction}>
            Confirmar
          </Button>
          <Button onPress={() => setOpenDialog(false)}>No agregar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default AsignarPrecio;
