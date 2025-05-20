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
import BaseConfig from "../../src/definitions/BaseConfig";
import BaseConfigModal from "../../src/Modals/BaseConfigModal";
import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';
import CONSTANTS from "../../src/definitions/Constants";
import Ionicons from "@expo/vector-icons/Ionicons"
import User from "src/Models/User";
import Log from "src/Models/Log";
import ModelConfig from "src/Models/ModelConfig";

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import { Button } from "react-native-paper";
import System from "src/Helpers/System";

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

  const listadoDispositivosDisponibles = () => {
    // showAlert("listadoDispositivosDisponibles")
    // return
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
    }, (err) => {
      console.log("error z", err)
      System.mostrarError(err)
    });

  }

  const vincularDispositivo = (dispositivoObj) => {
    BluetoothManager.connect(dispositivoObj.address) // the device address scanned.
      .then((s) => {
        System.mostrarError("Realizado correctamente")
        setDispositivosConectados([...dispositivosConectados, dispositivoObj])
      }, (e) => {
        if (e.message === "Unable to connect device") {
          Alert.alert("No se pudo conectar.\nReintentar nuevamente.")
          return
        }
        System.mostrarError(e);
      })

  }

  const desvincularDispositivo = (dispositivoObj) => {
    BluetoothManager.unpaire(dispositivoObj.address) // the device address scanned.
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
                <Button style={{
                  backgroundColor: "blue",
                  borderRadius: 10,
                }} onPress={() => {
                  // Alert.alert("conectar:" + dis.name)
                  vincularDispositivo(dis)
                }}>
                  <Text style={{
                    color: "white"
                  }}>Conectar</Text>
                </Button>
              </View>
            ))}
          </ScrollView>
        )}






        {dispositivosConectados.length < 1 ? (
          <Text>No se encontraron dispositivos conectados</Text>
        ) : (
          <Text>Listado dispositivos conectados</Text>
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
          flexDirection: "row"
        }}>
          <Button style={{
            backgroundColor: "rgb(70 0 248)",
            borderRadius: 10,
            margin: 20
          }} onPress={() => {
            // Alert.alert("conectar:" + dis.name)
            setDispositivosDisponibles([])
            setTimeout(() => {
              listadoDispositivosDisponibles()
            }, 1000);
          }}>
            <Text style={{
              color: "white"
            }}>Recargar listado</Text>
          </Button>

          <Button style={{
            backgroundColor: "#c0c",
            borderRadius: 10,
            margin: 20
          }} onPress={() => {
            // Alert.alert("conectar:" + dis.name)
            prueba1()
          }}>
            <Text style={{
              color: "white"
            }}>Probar imp</Text>
          </Button>

        </View>
        <View style={{
          flex: 1,
          width: "100%",
          padding: 0,
          // backgroundColor:"red",
          flexDirection: "row"
        }}>

          <Button style={{
            backgroundColor: "rgb(85 204 0)",
            borderRadius: 10,
            width: "50%",
            // height:50
          }} onPress={() => {
            if (dispositivosConectados.length < 1) {
              onSave("")
            } else {
              onSave(dispositivosConectados[0])
            }
          }}>
            <Text style={{
              color: "white"
            }}>GUARDAR</Text>
          </Button>

          <Button style={{
            backgroundColor: "rgb(201 199 201)",
            borderRadius: 10,
            width: "48%",
            height: 50,
            marginLeft: "1%"
          }} onPress={() => {
            // Alert.alert("conectar:" + dis.name)
            onCancel()
          }}>
            <Text style={{
              color: "white"
            }}>VOLVER</Text>
          </Button>

          {/* <Image source={img1} /> */}
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
    padding: 20,
    backgroundColor: "#f5f5f5",
    overflow: "scroll"
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
  foto: {
    width: "40%",
    height: "40%",
    resizeMode: 'contain',
  }
});
