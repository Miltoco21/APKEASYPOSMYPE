import React, { useState, useEffect, useContext } from 'react';

import { StyleSheet, View } from 'react-native';
import { Surface, Title, Button } from 'react-native-paper';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import BoxBoleta from './BoxBoleta'
import PagarBoleta from '../ScreenDialog/PagarBoleta';
import Log from 'src/Models/Log';
import Colors from '../Colores/Colores';
import UltimaVenta from 'src/Modals/UltimaVenta';


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
    showAlert
  } = useContext(SelectedOptionsContext);

  const [showModalPagarBoleta, setShowModalPagarBoleta] = useState(false);
  const [showUltimaVenta, setShowUltimaVenta] = useState(false);

  const abrirBoleta = () => {
    if (salesData.length < 1) {
      showAlert("No hay productos en el listado")
      return
    }

    Log("ventas", salesData)
    setShowModalPagarBoleta(true)
  }

  return (
    <View style={styles.container}>
      <Title style={styles.totalText}>TOTAL: ${grandTotal}</Title>
      <View style={styles.buttonRow}>
        <Button mode="contained" style={styles.button} onPress={abrirBoleta}>
          Hacer el pago
        </Button>

        <Button mode="contained" style={styles.buttonU} onPress={()=>{
          setShowUltimaVenta(true)
        }}>
          Ultima venta
        </Button>
        {/* <Button mode="contained" style={styles.button} onPress={onPagarFactura}>
         Factura
        </Button> */}
      </View>


      <PagarBoleta openDialog={showModalPagarBoleta} setOpenDialog={setShowModalPagarBoleta} />
      <UltimaVenta visible={showUltimaVenta} onCancel={()=>setShowUltimaVenta(false)}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 100,
    padding: 3,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  totalText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,



  },
  buttonRow: {
    //flexDirection: 'row',
    //justifyContent: 'center',
    gap: 10, // Espacio entre botones
    marginBottom: 8,

  },
  button: {
    // flex: 1,
    // marginHorizontal: 4,
    backgroundColor: Colors.azul,
    //flex: 1,
    //minWidth: '48%', // Ancho mínimo relativo
    marginHorizontal: 5,
    height: 63, // Altura fija
    justifyContent: 'center', // Centrar texto verticalmente
    borderRadius: 8, // Bordes redondeados
    
  },
  buttonU: {

    backgroundColor: Colors.gris,
    //flex: 1,
    width: '48%', 
    marginHorizontal: 5,
    height: 63, // Altura fija
    justifyContent: 'center', // Centrar texto verticalmente
    borderRadius: 8, // Bordes redondeados
    
  },
});

export default BoxTotales;
