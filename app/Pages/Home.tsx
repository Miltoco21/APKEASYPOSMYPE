import React from "react";
import { Text, View, StyleSheet, } from "react-native";
import Box from "../../src/Componentes/Box";
import BoxContainer from "../../src/Componentes/BoxContainer";
import BoxTop from "../../src/Componentes/BoxContent/BoxTop";
import BusquedaProductos from "../../src/Componentes/BoxContent/BusquedaProductos";
import BottomButtons from "../../src/Componentes/BoxContent/BottomButtons";
import BoxTotales from "../../src/Componentes/BoxContent/BoxTotales";

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
