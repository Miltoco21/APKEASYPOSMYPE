import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

const BotonClienteOUsuario = ({ openDialog, setOpenDialog, onSelect }) => {
  return (
    <Modal visible={openDialog} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Elegir opción</Text>
          <Button title="Cliente" onPress={() => onSelect("cliente")} />
          <Button title="Usuario" onPress={() => onSelect("usuario")} />
          <Button title="Cerrar" onPress={() => setOpenDialog(false)} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default BotonClienteOUsuario;
