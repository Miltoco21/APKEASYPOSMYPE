import React, { useState, useEffect, useContext } from 'react';

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Title, Button, Icon, Text } from 'react-native-paper';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import BoxBoleta from './BoxBoleta'
import PagarBoleta from '../ScreenDialog/PagarBoleta';
import Log from 'src/Models/Log';
import Colors from '../Colores/Colores';
import UltimaVenta from 'src/Modals/UltimaVenta';
import System from 'src/Helpers/System';
import ModelConfig from 'src/Models/ModelConfig';


const BoxTotales = ({
  onPagarBoleta = () => { },
  onPagarFactura = () => { },
  onOpcion3 = () => { },
  onOpcion4 = () => { },
}) => {

  const {
    grandTotal,
    salesData,
    addToSalesData,
    removeFromSalesData,
    clearSalesData,
    salesDataTimestamp,
    showAlert,
    ultimoVuelto,
    tieneFocoTeclado,
    setTieneFocoTeclado,
    showMessage,
    modoAvion,
    setModoAvion
  } = useContext(SelectedOptionsContext);

  const [showModalPagarBoleta, setShowModalPagarBoleta] = useState(false);
  const [showUltimaVenta, setShowUltimaVenta] = useState(false);

  const abrirBoleta = () => {
    if (salesData.length < 1) {
      showAlert("No hay productos en el listado")
      return
    }

    setShowModalPagarBoleta(true)
  }

  return (
    <View style={{
      ...styles.container, ...{
        display: (tieneFocoTeclado ? "none" : "flex")
      }
    }}>
      <Title style={styles.totalText}>TOTAL: ${System.formatMonedaLocal(grandTotal, false)}</Title>
      <ScrollView horizontal={true} style={styles.buttonsRow}>

        <TouchableOpacity style={styles.buttonCard} onPress={() => {
          setShowUltimaVenta(true)
        }}>
          <Icon source={"page-previous-outline"} size={25} />
          <Text style={styles.textCard}>&Uacute;ltima</Text>
          <Text style={styles.textCard}>Venta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          ...{ ...styles.buttonCardPay }, ...{
            backgroundColor: (modoAvion ? "#F3FEFF" : "#DEFEDE"),
          }
        }}
          onLongPress={async () => {
            if (modoAvion) {
              showAlert("Cambiado a modo normal")
            } else {
              showAlert("Cambiado a modo avion")
            }
            setModoAvion(!modoAvion)

            await ModelConfig.change("emitirBoleta", modoAvion)

          }} onPress={abrirBoleta}>
          <Icon source={"currency-usd"} size={35} />
          <Text style={styles.textCard}>Registrar el</Text>
          <Text style={styles.textCardGrande}>PAGO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCard} onPress={() => {
          // setShowUltimaVenta(true)
        }}>
          <Icon source={"book-arrow-left-outline"} size={25} />
          <Text style={styles.textCard}>&Uacute;ltimo Vuelto</Text>

          {ultimoVuelto
            ? (<Text style={styles.textCard}>${System.formatMonedaLocal(ultimoVuelto, false)}</Text>)
            : (<Text style={styles.textCard}>N/D</Text>)}
        </TouchableOpacity>


        {/* <Button mode="contained" style={styles.button} onPress={onPagarFactura}>
         Factura
        </Button> */}
      </ScrollView>


      <PagarBoleta openDialog={showModalPagarBoleta} setOpenDialog={setShowModalPagarBoleta} />
      <UltimaVenta visible={showUltimaVenta} onCancel={() => setShowUltimaVenta(false)} />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 6,
    // padding: 1,
    // elevation: 3,
    position: "absolute",
    bottom: 70,
    width: "100%",
    left: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    // backgroundColor: '#FFFFFFDF',
    alignItems: "center",
    // backgroundColor: '#D10000DF',
  },
  totalText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonsRow: {
    // backgroundColor: "blue",
    // gap: 10, // Espacio entre botones
    marginBottom: 8,
    display: "flex",
    width: "95%",
    alignContent: "center",
    flexDirection: "row",
  },

  buttonCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: "3%",
    paddingHorizontal: 10,
    height: 110, // Altura fija
    minWidth: "30%",
    justifyContent: 'center', // Centrar texto verticalmente
    alignItems: "center",
    borderRadius: 8, // Bordes redondeados
  },

  buttonCardPay: {
    borderWidth: 1,
    // backgroundColor: "#DEFEDE",//boleta
    backgroundColor: "#F3FEFF",//ticket
    borderColor: "#ccc",
    marginHorizontal: "3%",
    paddingHorizontal: 10,
    height: 110, // Altura fija
    minWidth: "30%",
    justifyContent: 'center', // Centrar texto verticalmente
    alignItems: "center",
    borderRadius: 8, // Bordes redondeados
  },

  textCard: {
    fontSize: 12,
  },
  textCardGrande: {
    fontSize: 20,
  },

});

export default BoxTotales;
