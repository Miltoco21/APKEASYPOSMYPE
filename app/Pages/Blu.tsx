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

  const [img1, setimg] = useState(null)


  const checkEnable = () => {
    BluetoothManager.isBluetoothEnabled().then((enabled) => {
      alert(enabled) // enabled ==> true /false
    }, (err) => {
      alert(err)
    });

  }

  const verDetalles = () => {
    BluetoothManager.scanDevices()
      .then((s) => {
        var ss = JSON.parse(s);//JSON string
        // this.setState({
        //   pairedDs: this.state.pairedDs.cloneWithRows(ss.paired || []),
        //   foundDs: this.state.foundDs.cloneWithRows(ss.found || []),
        //   loading: false
        // }, () => {
        //   this.paired = ss.paired || [];
        //   this.found = ss.found || [];
        // });

        Log("encontrados: ", ss.found)
        Log("vinculados: ", ss.paired)
      }, (er) => {
        // this.setState({
        //   loading: false
        // })
        alert('error' + JSON.stringify(er));
      });
  }




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

  const vincularDispositivo = (dispositivoObj) => {
    console.log("vincularDispositivo..")
    Log("Dispositivo a conectar:", dispositivoObj)
    BluetoothManager.connect(dispositivoObj.address) // the device address scanned.
      .then((s) => {
        // this.setState({
        //   loading: false,
        //   boundAddress: direccionDispositivo
        // })
        alert("Realizado correctamente")
        setDispositivosConectados([...dispositivosConectados, dispositivoObj])
      }, (e) => {
        // this.setState({
        //   loading: false
        // })
        alert("No se pudo vincular: " + e);
      })

  }

  const desvincularDispositivo = (dispositivoObj) => {
    console.log("desvincularDispositivo..")
    Log("Dispositivo a desconectar:", dispositivoObj)
    BluetoothManager.unpaire(dispositivoObj.address) // the device address scanned.
      .then((s) => {
        // this.setState({
        //   loading: false,
        //   boundAddress: direccionDispositivo
        // })
        alert("Realizado correctamente")
        const lis = []
        dispositivosConectados.forEach((dis) => {
          if (dis.address != dispositivoObj.address) {
            lis.push(dis)
          }
        })
        setDispositivosConectados([...lis])
      }, (e) => {
        // this.setState({
        //   loading: false
        // })
        alert("No se pudo desvincular: " + e);
      })

  }


  const desconectarBluetooth = () => {
    BluetoothManager.disableBluetooth().then(() => {
      // do something.
    }, (err) => { alert(err) });
  }


  const detectarEventos = () => {
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp) => {
        setDispositivosConectados([...dispositivosConectados, JSON.parse(rsp)])
        // this._deviceAlreadPaired(rsp) // rsp.devices would returns the paired devices array in JSON string.
      });
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
        setDispositivosDisponibles([...dispositivosDisponibles, JSON.parse(rsp)])
        // this._deviceFoundEvent(rsp) // rsp.devices would returns the found device object in JSON string
      });
  }



  // FUNCIONES PARA IMPRIMIR
  const impAlignIzquierda = async () => {
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT
    );
  }

  const impAlignCentro = async () => {
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );
  }

  const impAlignDerecha = async () => {
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.RIGHT
    );
  }
  const impQR = async (contenido) => {
    await BluetoothEscposPrinter.printQRCode(contenido, 120, 0);
  }

  const impCols = async () => {
    let columnWidths = [12, 7, 7, 7];
    await BluetoothEscposPrinter.printColumn(columnWidths,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ["texto1", 'texto2', 'texto3', 'texto4'], {});
  }

  const impImg = async (imagen) => {
    await BluetoothEscposPrinter.printPic(imagen, {
      width: 120,
      height: 57
    });
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

    let options = {
      width: 40,
      height: 30,
      gap: 20,
      direction: BluetoothTscPrinter.DIRECTION.FORWARD,
      reference: [0, 0],
      tear: BluetoothTscPrinter.TEAR.ON,
      sound: 0,
      text: [{
        text: 'I am a testing txt',
        x: 20,
        y: 0,
        fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
        rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
        xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        yscal: BluetoothTscPrinter.FONTMUL.MUL_1
      }, {
        text: '你在说什么呢?',
        x: 20,
        y: 50,
        fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
        rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
        xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        yscal: BluetoothTscPrinter.FONTMUL.MUL_1
      }],
      qrcode: [{
        x: 20,
        y: 96,
        level: BluetoothTscPrinter.EEC.LEVEL_L,
        width: 3,
        rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
        code: 'show me the money'

      }],
      // barcode: [{ x: 120, y: 96, type: BluetoothTscPrinter.BARCODETYPE.CODE128, height: 40, readable: 1, rotation: BluetoothTscPrinter.ROTATION.ROTATION_0, code: '1234567890' }],
      // image: [{ x: 160, y: 160, mode: BluetoothTscPrinter.BITMAP_MODE.OVERWRITE, width: 60, image: base64Image }]
    }
    // BluetoothTscPrinter.printLabel(options)
    //   .then(() => {
    //     //success
    //     alert("correcto")
    //   },
    //   (err) => {
    //     //error
    //     alert("error: " + err)
    //     })
    //     return
    try {
      impAlignIzquierda()
      await BluetoothEscposPrinter.setBlob(20);
      impTexto("hola")
      // impEnter()
      // impAlignCentro()
      // impQR("1234567890123")
      // impAlignIzquierda()
      // impTexto("hola")
      // impAlignDerecha()
      // impTexto("hola2")

      // impImg(img1)
      // impCols()

      impEnter()
    } catch (err) {
      alert("error: " + err)
    }
  }
  // FIN FUNCIONES PARA IMPRIMIR


  const cargarImg2 = async () => {
    // setimg(await FileSystem.readAsStringAsync("../../", { encoding: 'base64' }))
    setimg(require("../../src/assets/images/splash-100x57-bn.jpg"))
  }

  useEffect(() => {
    listadoDispositivosDisponibles()
    // checkEnable()
    // verDetalles()
    detectarEventos()


    cargarImg2()
  }, [])


  useEffect(() => {
    Log("cambio dispositivosConectados", dispositivosConectados)
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
                  // alert("conectar:" + dis.name)
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
              // alert("conectar:" + dis.name)
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
            // alert("conectar:" + dis.name)
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
            // alert("conectar:" + dis.name)
            prueba1()
          }}>
            <Text style={{
              color: "white"
            }}>Probar imp</Text>
          </Button>

        </View>
        <View style={{
          flex: 1,
          width:"100%",
          padding:0,
          // backgroundColor:"red",
          flexDirection: "row"
        }}>

          <Button style={{
            backgroundColor: "rgb(85 204 0)",
            borderRadius: 10,
            width:"50%",
            // height:50
          }} onPress={() => {
            // alert("conectar:" + dis.name)
            onSave(dispositivosConectados)
          }}>
            <Text style={{
              color: "white"
            }}>GUARDAR</Text>
          </Button>

          <Button style={{
            backgroundColor: "rgb(201 199 201)",
            borderRadius: 10,
            width:"48%",
            height:50,
            marginLeft:"1%"
          }} onPress={() => {
            // alert("conectar:" + dis.name)
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
