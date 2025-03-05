import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Dialog, Portal, Button, Text, TextInput } from "react-native-paper";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import BoxBoleta from "../BoxContent/BoxBoleta";

import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';

const PagarBoleta = ({
  openDialog,
  setOpenDialog
}) => {

  const {
    userData,
    salesData,
    updateUserData,
    showLoading,
    hideLoading,
    GeneralElements,
    showAlert
  } = useContext(SelectedOptionsContext);

  

  return (
    <Modal
      visible={openDialog}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOpenDialog(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text>Pagar Boleta</Text>

          <View>
            <BoxBoleta
              onClose={() => { setOpenDialog(false) }}
              visible={true} />
          </View>

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

  text: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default PagarBoleta;
