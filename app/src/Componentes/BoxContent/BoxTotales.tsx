import React, { useState, useEffect, useContext } from 'react';

import { StyleSheet, View } from 'react-native';
import { Surface, Title, Button } from 'react-native-paper';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';


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
  return (
    <Surface style={styles.container}>
      <Title style={styles.totalText}>TOTAL: ${grandTotal}</Title>
      <View style={styles.buttonRow}>
        <Button mode="contained" style={styles.button} onPress={onPagarBoleta}>
          Boleta
        </Button>
        <Button mode="contained" style={styles.button} onPress={onPagarFactura}>
         Factura
        </Button>
      </View>
      <View style={styles.buttonRow}>
        <Button mode="contained" style={styles.button} onPress={onOpcion3}>
    btn 1
        </Button>
        <Button mode="contained" style={styles.button} onPress={onOpcion4}>
          btn 2
        </Button>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 1,
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
