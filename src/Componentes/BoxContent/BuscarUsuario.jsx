import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import User from "../../Models/User";
import { SafeAreaView } from "react-native-safe-area-context";

const BuscarUsuario = ({ openDialog, setOpenDialog, onSelect }) => {
  const [usuarios, setUsuarios] = useState([]);


  const buscarUsuariosServidor = async()=>{

    console.log("Buscando trabajadores del servidor");
    await User.getInstance().getAllFromServer(
      (all) => setUsuarios(all),
      () => setUsuarios([])
    );
  }


  useEffect(() => {
    buscarUsuariosServidor()
  }, []);

  return (
    <Modal visible={openDialog} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Seleccionar Usuario</Text>
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem} onPress={() => onSelect(item)}>
                <Text style={styles.userText}>{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setOpenDialog(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  userItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  userText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default BuscarUsuario;
