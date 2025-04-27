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
    <Surface style={styles.container}>
      <Title style={styles.totalText}>TOTAL: ${grandTotal}</Title>
      <View style={styles.buttonRow}>
        <Button mode="contained" style={styles.button} onPress={abrirBoleta}>
          Hacer el pago
        </Button>

        <Button mode="contained" style={styles.button} onPress={()=>{
          setShowUltimaVenta(true)
        }}>
          Ultima venta
        </Button>
        {/* <Button mode="contained" style={styles.button} onPress={onPagarFactura}>
         Factura
        </Button> */}
      </View>
      {/* <View style={styles.buttonRow}>
        <Button mode="contained" style={styles.button} onPress={onOpcion3}>
    btn 1
        </Button>
        <Button mode="contained" style={styles.button} onPress={onOpcion4}>
          btn 2
        </Button>
      </View> */}

      <PagarBoleta openDialog={showModalPagarBoleta} setOpenDialog={setShowModalPagarBoleta} />
      <UltimaVenta visible={showUltimaVenta} onCancel={()=>setShowUltimaVenta(false)}/>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 100,
    padding: 5,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: Colors.azul,
  },
});

export default BoxTotales;
