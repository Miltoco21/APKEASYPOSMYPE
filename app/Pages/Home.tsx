import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, } from "react-native";
import Box from "../../src/Componentes/Box";
import BoxContainer from "../../src/Componentes/BoxContainer";
import BoxTop from "../../src/Componentes/BoxContent/BoxTop";
import BusquedaProductos from "../../src/Componentes/BoxContent/BusquedaProductos";
import BottomButtons from "../../src/Componentes/BoxContent/BottomButtons";
import BoxTotales from "../../src/Componentes/BoxContent/BoxTotales";
import AbrirCaja from "src/Componentes/ScreenDialog/AbrirCaja";


import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';


const Home = ({

}) => {

  const {
    userData,
    updateUserData,
    showLoading,
    hideLoading,
    GeneralElements,
    showAlert,
    focusSearchInput
  } = useContext(SelectedOptionsContext);

  const [isCajaOpen, setIsCajaOpen] = useState(false);

  // Función para cerrar el componente AbrirCaja
  const handleCloseCaja = () => {
    setIsCajaOpen(false);
  };


  useEffect(() => {
    if (userData && !Array.isArray(userData) && !userData.inicioCaja) {
      console.log("no tiene iniciada la caja");
      // console.log(userData)
      setIsCajaOpen(true);
    }
  }, [userData])

  return (
    <Box>
      <GeneralElements />
      <AbrirCaja openDialog={isCajaOpen} setOpenDialog={setIsCajaOpen} />
      <View style={styles.mainContainer}>
        <BoxTop />
        <BusquedaProductos />
        <BoxTotales />


        <BottomButtons />

      </View>
    </Box>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative'
  },
  bottomWrapper: {


  }
});
export default Home;
