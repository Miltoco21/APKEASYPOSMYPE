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
  Alert,
} from "react-native";
import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';
import Log from "src/Models/Log";

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import { Button } from "react-native-paper";
import System from "src/Helpers/System";
import SmallButton from "src/Componentes/Elements/SmallButton";
import StorageSesion from "src/Helpers/StorageSesion";

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
  
  const [contentShared, setcontentShared] = useState("");

  const listadoDispositivosDisponibles = async () => {
    var msys = System
    console.log("listadoDispositivosDisponibles")
    try {
      BluetoothManager.enableBluetooth().then((r) => {
        var paired = [];
        if (r && r.length > 0) {
          for (var i = 0; i < r.length; i++) {
            try {
              paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
            } catch (e) {
              //ignore
              Alert.alert("No se pudo obtener el listado")
            }
          }
        }
        setDispositivosDisponibles(paired)
        Alert.alert("Carga correcta")
        // Log("dispositivos:", JSON.stringify(paired))
      }, (err) => {
        console.log("error 1")
        setcontentShared(msys.mostrarError(err))
      });
    } catch (err) {
      console.log("error 2")
      setcontentShared(msys.mostrarError(err))
    }
  }

  // const verSesion = async () => {

  //   // const ss = new StorageSesion("pirulo")

  //   // const all = await ss.verTodos()

  //   var SharedPreferences = require('react-native-shared-preferences');
  //   SharedPreferences.setName("sesionandroidstudio");

  //   var txt = "";
  //   SharedPreferences.getAll(function (values) {
  //     console.log(values);
  //     values.forEach((vale)=>{
  //       console.log(vale);
  //     })
  //   });

  // }

  useEffect(() => {
    // verSesion()
  }, [])


  return (
    <View>
      <Text>Impresion bluetooth 4</Text>
      <SmallButton textButton={"cargar listado"} actionButton={() => {
        listadoDispositivosDisponibles()
      }} />
      <Text>Contenidos shared:</Text>
      <Text>{contentShared}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
});
