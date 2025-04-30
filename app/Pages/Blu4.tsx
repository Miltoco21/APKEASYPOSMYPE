import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  DeviceEventEmitter,
  ScrollView,
} from "react-native";
import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';
import Log from "src/Models/Log";

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import { Button } from "react-native-paper";

export default function Blu({
}) {

  const {
    userData,
    updateUserData,
    showLoading,
    hideLoading,
    GeneralElements,
    showAlert
  } = useContext(SelectedOptionsContext);

  const [dispositivosDisponibles, setDispositivosDisponibles] = useState([]);
  const [dispositivosConectados, setDispositivosConectados] = useState([]);


  const listadoDispositivosDisponibles = () => {
    BluetoothManager.enableBluetooth().then((r) => {
      var paired = [];
      if (r && r.length > 0) {
        for (var i = 0; i < r.length; i++) {
          try {
            paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
          } catch (e) {
            //ignore
            alert("No se pudo obtener el listado")
          }
        }
      }
      setDispositivosDisponibles(paired)
      Log("despositivos:", JSON.stringify(paired))
    }, (err) => {
      alert(err)
    });

  }


  useEffect(() => {
    listadoDispositivosDisponibles()

  }, [])


  return (
    <View>
      <Text>Impresion bluetooth 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
});
