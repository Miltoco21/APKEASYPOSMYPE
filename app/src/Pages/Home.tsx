import React from "react";
import { View } from "react-native";
import Box from "../Componentes/Box";
import BoxContainer from "../Componentes/BoxContainer";
import BoxTop from "../Componentes/BoxContent/BoxTop";

const Home = () => {
  return (
    <Box>
      <View>
        <BoxContainer title="Sección 1">
       <BoxTop/>
        </BoxContainer>

        <BoxContainer title="Sección 2">
          {/* Contenido de la sección 2 */}
        </BoxContainer>

        <BoxContainer title="Sección 3">
          {/* Contenido de la sección 3 */}
        </BoxContainer>
      </View>
    </Box>
  );
};

export default Home;
