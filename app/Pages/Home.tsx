import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, } from "react-native";
import Box from "../../src/Componentes/Box";
import BoxContainer from "../../src/Componentes/BoxContainer";
import BoxTop from "../../src/Componentes/BoxContent/BoxTop";
import BusquedaProductos from "../../src/Componentes/BoxContent/BusquedaProductos";
import BottomButtons from "../../src/Componentes/BoxContent/BottomButtons";
import BoxTotales from "../../src/Componentes/BoxContent/BoxTotales";
import AbrirCaja from "src/Componentes/ScreenDialog/AbrirCaja";
import Log from "src/Models/Log";


import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';
import { ProviderModalesContext } from '../../src/Componentes/Context/ProviderModales';


const Home = ({

}) => {

  const {
    GeneralElements2,
  } = useContext(ProviderModalesContext);

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


  // useEffect(() => {
  //   if (userData && !Array.isArray(userData) && !userData.inicioCaja) {
  //     console.log("no tiene iniciada la caja");
  //    Log("userdata para caja",userData)
  //     setIsCajaOpen(true);
  //   }
  // }, [userData])
  useEffect(() => {
    // Verifica si userData está cargado y si la caja NO está iniciada
    // console.log("revision inicio caja")
    if (userData && !userData.inicioCaja) {
      // console.log("Caja NO iniciada - Mostrando modal");
      // console.log("debe hacer inicio caja")
      setIsCajaOpen(true);
    } else {
      // console.log("no debe hacer inicio caja")
      setIsCajaOpen(false);
    }
  }, [userData]); // Se ejecuta cuando userData cambia

  
 

  return (

    <Box style={styles.container}>
    <GeneralElements />
    <GeneralElements2 />
    <AbrirCaja openDialog={isCajaOpen} setOpenDialog={setIsCajaOpen} />
    
    {/* Contenido principal */}
    <View style={styles.mainContent}>
      <BoxTop />
      <BusquedaProductos />
      <BoxTotales />
    </View>

    {/* Botones fijos en la parte inferior */}
    <View style={styles.bottomButtons}>
      <BottomButtons />
    </View>
  </Box>
    // <Box>
    //   <GeneralElements />
    //   <AbrirCaja openDialog={isCajaOpen} setOpenDialog={setIsCajaOpen} />
    //   <View style={styles.mainContainer}>
    //     <BoxTop />
    //     <BusquedaProductos />
    //     <BoxTotales />


      

    //   </View>
    //   <View style={styles.bottomWrapper} >
    //   <BottomButtons />

    //   </View>

    // </Box>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  mainContent: {
    flex: 1,
    paddingBottom: 60 // Ajustar según altura de los botones
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  }
});
export default Home;
