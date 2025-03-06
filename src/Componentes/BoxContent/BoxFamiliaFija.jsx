import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxProductoFamilia from "./BoxProductoFamilia";
import ModelConfig from "../../Models/ModelConfig";

const BoxFamiliaFija = ({ whenApply = () => {} }) => {
  const {
    // Se mantienen las variables del contexto, en caso de ser necesarias en otros componentes.
    userData,
    salesData,
    clearSessionData,
    clearSalesData,
    getUserData,
    setShowLoadingDialogWithTitle,
    hideLoadingDialog,
    setShowLoadingDialog,
    showConfirm,
    showMessage,
    showAlert,
    searchInputRef,
    suspenderYRecuperar,
  } = useContext(SelectedOptionsContext);

  const [fijarFamilia, setFijarFamilia] = useState(false);

  useEffect(() => {
    setFijarFamilia(ModelConfig.get("fijarFamilia"));
  }, []);

  useEffect(() => {
    if (fijarFamilia) {
      whenApply();
    }
  }, [fijarFamilia]);

  if (!fijarFamilia) return null;

  return (
    <View style={styles.paper}>
      <View style={styles.container}>
        <View style={styles.item}>
          <BoxProductoFamilia />
        </View>
        <View style={styles.item}>
          {/* Puedes agregar aquí otros componentes o contenido adicional */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paper: {
    backgroundColor: "#859398",
    padding: 10,
    width: "100%",
    // height: 200, // Descomenta si necesitas una altura fija
    elevation: 3, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 10,
  },
  container: {
    flexDirection: "column", // Como xs=12 en MUI, cada elemento ocupa el 100% del ancho
    justifyContent: "center",
  },
  item: {
    width: "100%",
    marginVertical: 8,
  },
});

export default BoxFamiliaFija;
