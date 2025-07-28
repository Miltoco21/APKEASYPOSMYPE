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
import Box from "../../src/Componentes/Box"
import { useRouter } from "expo-router";
import BaseConfigModal from "../../src/Modals/ConfigModal";
import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';
import CONSTANTS from "../../src/definitions/Constants";
import Ionicons from "@expo/vector-icons/Ionicons"
import User from "src/Models/User";
import Log from "src/Models/Log";
import ModelConfig from "src/Models/ModelConfig";

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import { Button } from "react-native-paper";
import System from "src/Helpers/System";
import ImpresionManual from "src/Modals/ImpresionManual";
import STYLES from "src/definitions/Styles";

export default function Blu({
  onSave,
  onCancel
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
  const [verImpManual, setVerImpManual] = useState(false);

  const listadoDispositivosDisponibles = async () => {
    // showAlert("listadoDispositivosDisponibles")
    // return
    showLoading("Cargando listado...")
    await BluetoothManager.enableBluetooth().then((r) => {
      hideLoading()
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
    }, (err) => {
      hideLoading()
      console.log("error z", err)
      System.mostrarError(err)
    });

  }

  const vincularDispositivo = async (dispositivoObj) => {
    showLoading("Conectando con " + dispositivoObj.name + "...")
    await BluetoothManager.connect(dispositivoObj.address) // the device address scanned.
      .then((s) => {
        setDispositivosConectados([...dispositivosConectados, dispositivoObj])
        hideLoading()
        System.mostrarError("Realizado correctamente")
      }, (e) => {
        hideLoading()
        if (e.message === "Unable to connect device") {
          Alert.alert("No se pudo conectar.\nReintentar nuevamente.")
          return
        }
        System.mostrarError(e);
      })
  }

  const desvincularDispositivo = async (dispositivoObj) => {
    await BluetoothManager.unpaire(dispositivoObj.address) // the device address scanned.
      .then((s) => {
        Alert.alert("Realizado correctamente")
        const lis = []
        dispositivosConectados.forEach((dis) => {
          if (dis.address != dispositivoObj.address) {
            lis.push(dis)
          }
        })
        setDispositivosConectados([...lis])
      }, (e) => {
        System.mostrarError(e);
      })

  }


  const impTexto = async (texto) => {
    await BluetoothEscposPrinter.printText(texto + "\n\r", {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 1,
      fonttype: 0
    });
  }
  const impEnter = async () => {
    await BluetoothEscposPrinter.printText("\n\r", {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 1,
      fonttype: 0
    });
  }

  const prueba1 = async () => {
    try {
      await BluetoothEscposPrinter.setBlob(20);
      impTexto("hola")
      impEnter()
    } catch (err) {
      if (err.message === "COMMAND_NOT_SEND") {
        Alert.alert("No se pudo imprimir. Revisar si esta conectada la impresora o reintentar nuevamente.")
        return
      }
      Alert.alert("error: " + err)
    }
  }

  useEffect(() => {
    listadoDispositivosDisponibles()
  }, [])


  useEffect(() => {
  }, [dispositivosConectados])

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Impresion bluetooth</Text>

        {dispositivosDisponibles.length < 1 ? (
          <Text>No se encontraron dispositivos</Text>
        ) : (
          <ScrollView style={{
            width: "100%",
            maxHeight: 200,
            overflow: "scroll",
          }}>

            <Text>Listado disponibles</Text>
            {dispositivosDisponibles.map((dis, ix) => (
              <View style={{
                padding: 10,
                borderWidth: 1,
                borderColor: "red",
                width: "100%",
                display: "flex",
                flexDirection: "row"
              }} key={ix}>
                <View style={{
                  flex: 1
                }}>
                  <Text >{dis.name}</Text>
                  <Text >{dis.address}</Text>
                </View>
                <TouchableOpacity style={STYLES.BUTTON.PRIMARY} onPress={() => {
                  // Alert.alert("conectar:" + dis.name)
                  vincularDispositivo(dis)
                }}>
                  <Text style={{
                    color: "white"
                  }}>Conectar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}


        <View style={{
          display: "flex",
          flex: 1,
          // flexDirection: "column"
          width: "100%",
          marginBottom: 20
        }}>
          <Button style={STYLES.BUTTON.PRIMARY} onPress={() => {
            // Alert.alert("conectar:" + dis.name)
            setDispositivosDisponibles([])
            listadoDispositivosDisponibles()
          }}>
            <Text style={STYLES.TEXT.BUTTON_MID}>Recargar listado</Text>
          </Button>
        </View>



        <Text style={{
          marginTop: 20,
          textAlign: "left",
          width: "100%",
          paddingLeft: 10,
          fontSize: 17
        }}>Listado dispositivos conectados</Text>

        {dispositivosConectados.length < 1 ? (
          <Text>No se encontraron dispositivos conectados</Text>
        ) : (
          <Text></Text>
        )}
        {dispositivosConectados.map((dis, ix) => (
          <View style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "red",
            width: "100%",
            display: "flex",
            flexDirection: "row"
          }} key={ix}>
            <Text style={{
              flex: 1
            }}>{dis.name}</Text>
            <Button style={{
              backgroundColor: "red",
              borderRadius: 10,
            }} onPress={() => {
              // Alert.alert("conectar:" + dis.name)
              desvincularDispositivo(dis)
            }}>
              <Text style={{
                color: "white"
              }}>Desconectar</Text>
            </Button>
          </View>
        ))}

        <View style={{
          flex: 1,
          marginTop: 20,
          flexDirection: "row",
          width: "100%",
          // backgroundColor: "red",
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          alignSelf: "center",
        }}>
          <Button style={STYLES.BUTTON.SECONDARY} onPress={() => {
            // Alert.alert("conectar:" + dis.name)
            prueba1()
          }}>
            <Text style={STYLES.TEXT.BUTTON_MID}>Probar imp</Text>
          </Button>

          <Button style={STYLES.BUTTON.SECONDARY} onPress={() => {
            setVerImpManual(true)
          }}>
            <Text style={STYLES.TEXT.BUTTON_MID}>Manual</Text>
          </Button>


        </View>
        <View style={{
          flex: 1,
          width: "100%",
          padding: 0,
          marginTop: 50,
          // backgroundColor:"red",
          flexDirection: "row",
        }}>

          <TouchableOpacity style={STYLES.BUTTON.ACTION} onPress={() => {
            if (dispositivosConectados.length < 1) {
              onSave("")
            } else {
              onSave(dispositivosConectados[0])
            }
          }}>
            <Text style={STYLES.TEXT.BUTTON_ACTION}>GUARDAR</Text>
          </TouchableOpacity>

          <Button style={{
            backgroundColor: "#e74c3c",
            borderRadius: 10,
            justifyContent: "center",
            flex: 0.5,
          }} onPress={() => {
            // Alert.alert("conectar:" + dis.name)
            onCancel()
          }}>
            <Text style={STYLES.TEXT.BUTTON_ACTION}>VOLVER</Text>
          </Button>

          {/* <Image source={img1} /> */}
          <ImpresionManual visible={verImpManual} onCancel={() => { setVerImpManual(false) }} />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 20,
    backgroundColor: "#f5f5f5",
    overflow: "scroll",
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 5
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

});
