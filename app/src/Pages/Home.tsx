import React from "react";
import { Text, View, StyleSheet, } from "react-native";
import Box from "../Componentes/Box";
import BoxContainer from "../Componentes/BoxContainer";
import BoxTop from "../Componentes/BoxContent/BoxTop";
import BusquedaProductos from "../Componentes/BoxContent/BusquedaProductos";
import BottomButtons from "../Componentes/BoxContent/BottomButtons";
import BoxTotales from "../Componentes/BoxContent/BoxTotales";

const Home = () => {
  return (
    <Box>
      <View style={styles.mainContainer}>
        <BoxTop />
        <BusquedaProductos />
        <BoxTotales/>
        
        <View style={styles.bottomWrapper}>
          <BottomButtons/>
        </View>
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
    flex: 1,
    position: 'relative',
    zIndex: 1
  }
});
export default Home;
