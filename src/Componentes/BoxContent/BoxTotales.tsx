import React, { useState, useEffect, useContext } from 'react';

import { StyleSheet, View } from 'react-native';
import { Surface, Title, Button } from 'react-native-paper';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import BoxBoleta from './BoxBoleta'
import PagarBoleta from '../ScreenDialog/PagarBoleta';


const BoxTotales = ({
  onPagarBoleta = () => {},
  onPagarFactura = () => {},
  onOpcion3 = () => {},
  onOpcion4 = () => {},
}) => {

  const {
    grandTotal,
      salesData,
      addToSalesData,
      removeFromSalesData,
      clearSalesData,
      salesDataTimestamp
    } = useContext(SelectedOptionsContext);

    const [showModalPagarBoleta, setShowModalPagarBoleta] = useState(false);

  return (
    <Surface style={styles.container}>
      <Title style={styles.totalText}>TOTAL: ${grandTotal}</Title>
      <View style={styles.buttonRow}>
      <Button mode="contained" style={styles.button} onPress={() => setShowModalPagarBoleta(true)}>
          Hacer el pago
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

      <PagarBoleta openDialog={showModalPagarBoleta} setOpenDialog={setShowModalPagarBoleta}/>
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
  },
});

export default BoxTotales;
