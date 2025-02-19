import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Dialog, Portal, Button, Text, TextInput } from "react-native-paper";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import Validator from "../Helpers/Validator";

const AsignarPeso = ({
  openDialog,
  setOpenDialog,
  product,
  onChange,
}) => {
  const [peso, setPeso] = useState(0);
  const [titulo, setTitulo] = useState("peso");

  const checkPeso = (nuevoPeso) => {

    if(product.pesable && Validator.isPeso(nuevoPeso)) {
      setPeso(nuevoPeso)
    }

    if(!product.pesable && Validator.isCantidad(nuevoPeso)) {
      setPeso(nuevoPeso)
    }
  };

  const handlerSaveAction = () => {
    if (peso === 0) {
      alert("Debe ingresar un correcto");
      return;
    }
    
    var pesoStr = peso + ""
    const ultimo = pesoStr.substring(pesoStr.length - 1)
    if (ultimo == "." || ultimo == ",") {
      alert("Debe ingresar un correcto");
      return
    }

    onChange(peso);
    setOpenDialog(false);
  };


  useEffect(() => {
    if (!openDialog) return

    if(product.isEnvase){
      setOpenDialog(false)
    }

    if(!product.pesable){
      setTitulo("cantidad")
    }

    setPeso(product.quantity)

  }, [openDialog])

  return (
    <Modal
      visible={openDialog}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOpenDialog(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text style={styles.title}>Asignar { titulo }</Text>
          <Text style={styles.text}>
            Ingrese { titulo } del producto {product ? product.nombre : ""}
          </Text>
          <TextInput
            label={titulo}
            mode="outlined"
            keyboardType="numeric"
            value={peso.toString()}
            onChangeText={checkPeso}
            style={styles.input}
          />
          <Button mode="contained" onPress={handlerSaveAction}>
            Confirmar
          </Button>
          <Button onPress={() => setOpenDialog(false)}>Volver</Button>
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

  title: {
    marginBottom: 10,
    fontSize: 20,
    marginBottom: 20
  },
  text: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default AsignarPeso;
