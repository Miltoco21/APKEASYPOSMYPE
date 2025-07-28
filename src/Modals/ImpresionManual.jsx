import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import System from 'src/Helpers/System';
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import PrinterBluetooth from 'src/Models/PrinterBluetooth';
import IngresoPLU from './IngresoPLU';
import IngresoTexto from './IngresoTexto';
import STYLES from 'src/definitions/Styles';

const ImpresionManual = ({ visible, onCancel }) => {

  const [showModalTexto, setShowModalTexto] = useState(false)
  const [accionPostIngresoTexto, setAccionPostIngresoTexto] = useState(() => { })
  const [showPLUModal, setShowPLUModal] = useState(false)

  useEffect(() => {
    setAccionPostIngresoTexto(() => { })
  }, [visible])

  const impAlgo = async (funcionImpresiones) => {
    try {
      funcionImpresiones()
    } catch (err) {
      if (err.message === "COMMAND_NOT_SEND") {
        Alert.alert("No se pudo imprimir. Revisar si esta conectada la impresora o reintentar nuevamente.")
        return
      }
      Alert.alert("error: " + err)
    }
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent={false}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <View style={styles.buttonContainer}>
              <Text style={STYLES.TEXT.TITLE}>
                Impresiones manuales
              </Text>

              <TouchableOpacity style={styles.button} onPress={() => {
                const ac = (textoIngresado) => {
                  impAlgo(async () => {
                    // await PrinterBluetooth.impTexto("Texto Chico");
                    await PrinterBluetooth.impTexto(textoIngresado);
                    await PrinterBluetooth.impEnter();
                    setShowModalTexto(false)
                  })
                }
                setAccionPostIngresoTexto(() => ac)
                setShowModalTexto(true)
              }}>
                <Text style={styles.buttonText}>
                  Texto chico
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                const ac = (textoIngresado) => {
                  impAlgo(async () => {
                    // await PrinterBluetooth.impTextoGrande("Texto Grande");
                    await PrinterBluetooth.impTextoGrande(textoIngresado);
                    await PrinterBluetooth.impEnter();
                    setShowModalTexto(false)
                  })
                }
                setAccionPostIngresoTexto(() => ac)
                setShowModalTexto(true)
              }
              }>
                <Text style={styles.buttonText}>
                  Texto Grande
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => {
                const ac = (textoIngresado) => {
                  impAlgo(async () => {
                    // await PrinterBluetooth.impTextoGrande("Texto Grande");
                    await PrinterBluetooth.impQR(textoIngresado);
                    await PrinterBluetooth.impEnter();
                    setShowModalTexto(false)
                  })
                }
                setAccionPostIngresoTexto(() => ac)
                setShowModalTexto(true)
              }}>
                <Text style={styles.buttonText}>
                  Qr
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => {
                const ac = (textoIngresado) => {
                  impAlgo(async () => {
                    // await PrinterBluetooth.impTextoGrande("Texto Grande");
                    await PrinterBluetooth.impBarra(textoIngresado);
                    await PrinterBluetooth.impEnter();
                    setShowPLUModal(false)
                  })
                }
                setAccionPostIngresoTexto(() => ac)
                setShowPLUModal(true)
              }}>
                <Text style={styles.buttonText}>
                  Codigo Barras
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={onCancel}>
              <Text style={styles.buttonText}>
                Volver
              </Text>
            </TouchableOpacity>
          </View>

          <IngresoTexto
            visible={showModalTexto}
            onConfirm={accionPostIngresoTexto}
            onCancel={() => { setShowModalTexto(false) }}
          />


          <IngresoPLU
            visible={showPLUModal}
            onConfirm={accionPostIngresoTexto}
            onCancel={() => setShowPLUModal(false)}
          />

        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    // height:"100%"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#283048',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    // width: '48%',
    justifyContent: 'center',
    backgroundColor: '#A8AEAB',
    marginBottom: 10
  },
  buttonBack: {
    backgroundColor: '#e74c3c',
    marginTop: 100,
    padding: 10,
    alignItems: "center"
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    textTransform: "uppercase",
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImpresionManual;