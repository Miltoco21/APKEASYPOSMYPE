import React from "react";
import { Text, View } from "react-native";
import Box from "../Componentes/Box";
import BoxContainer from "../Componentes/BoxContainer";
import BoxTop from "../Componentes/BoxContent/BoxTop";
import BusquedaProductos from "../Componentes/BoxContent/BusquedaProductos";

const Home = () => {
  return (
    <Box>
      <View>

        <BoxTop />
        <BusquedaProductos />
      </View>
    </Box>
  );
};

export default Home;
