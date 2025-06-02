import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importa tus componentes y modelos nativos equivalentes
import BoxCierreCajaPaso1 from '../Componentes/BoxContent/BoxCierreCajaPaso1';
import BoxCierreCajaPaso2 from 'src/Componentes/BoxContent/BoxCierreCajaPaso2';
import { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';
import InfoCierre from '../Models/InfoCierre';
import CerrarCaja from '../Models/CerrarCaja';
import Printer from '../Models/Printer';
import UserEvent from '../Models/UserEvent';
import System from '../Helpers/System';
import Log from 'src/Models/Log';
import { useRouter } from "expo-router";
import PrinterBluetooth from 'src/Models/PrinterBluetooth';

const CierreCajaModal = ({
  visible,
  onDismiss
}) => {
  const {
    userData,
    clearSessionData,
    showAlert,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);
  const router = useRouter();

  // Estados para controlar pasos y datos
  const [step, setStep] = useState(1);
  const [infoCierre, setInfoCierre] = useState(null);
  const [arrayBilletes, setArrayBilletes] = useState([]);
  const [totalEfectivo, setTotalEfectivo] = useState(0);
  const [enviando, setEnviando] = useState(false);

  // Inicia los controles al mostrarse el modal
  const iniciarControles = () => {
    setStep(1);
    setInfoCierre(null);
    setArrayBilletes([]);
    setTotalEfectivo(0);
  };

  const cargarInfoCierre = () => {
    // console.log("buscando info de cierre de caja");
    const infoCierreServidor = new InfoCierre();
    infoCierreServidor.obtenerDeServidor(
      userData.codigoUsuario,
      (info) => {
        setInfoCierre(info);
        // console.log("info de cierre cargada correctamente", info);
      },
      () => {
        showAlert("Hubo un problema de conexión. Solicitar al administrador para hacer el cierre administrativo.");
        onDismiss();
      }
    );
  };

  useEffect(() => {
    // console.log("carga la pantalla de cierre de caja")
    // Log("userData", userData)
    if (visible) {
      iniciarControles();
      if (userData && userData.codigoUsuario)
        cargarInfoCierre();
    }
  }, [visible, userData]);

  const handleOnNext = () => {
    // console.log("arrayBilletes:", arrayBilletes);
    if (arrayBilletes.length < 1) {
      showAlert("Agregar los billetes para continuar.");
      return;
    }

    UserEvent.send({
      name: "presiono boton next en cierre de caja",
      info: ""
    });

    setStep(2);
  };

  const handleOnPrev = () => {
    UserEvent.send({
      name: "presiono boton 'previo' en cierre de caja",
      info: ""
    });
    setStep(1);
  };

  const handleOnFinalizar = () => {
    UserEvent.send({
      name: "presiono boton finalizar cierre de caja",
      info: ""
    });

    // Calcula la diferencia
    const diferencia = totalEfectivo - infoCierre.arqueoCajaById.totalSistema;
    // console.log("totalSistema", infoCierre.arqueoCajaById.totalSistema);
    // console.log("totalEfectivo", totalEfectivo);
    // console.log("diferencia", diferencia);

    const data = {
      idTurno: userData.idTurno,
      totalSistema: infoCierre.arqueoCajaById.totalSistema,
      totalIngresado: totalEfectivo,
      diferencia: diferencia,
      codigoUsuario: userData.codigoUsuario,
      fechaIngreso: System.getInstance().getDateForServer(),
      // cajaArqueoDetalles: arrayBilletes
    };

    cajaArqueoDetalles = []

    arrayBilletes.forEach((bille) => {
      cajaArqueoDetalles.push({
        denoBillete: bille.denomination + "",
        cantidad: bille.quantity,
        valor: bille.subtotal
      })
    })

    data.cajaArqueoDetalles = cajaArqueoDetalles

    setEnviando(true);
    const cerrarCaja = new CerrarCaja();

    showLoading("Haciendo cierre...")
    cerrarCaja.enviar(
      data,
      (res) => {
        hideLoading()
        setEnviando(false);
        showAlert("Caja cerrada correctamente.");
        UserEvent.send({
          name: "cierre de caja correctamente",
          info: ""
        });

        data.operacion = "cierreCaja"
        data.userInfo = System.clone(userData)
        PrinterBluetooth.prepareBluetooth(() => {
          PrinterBluetooth.printAll(data, res);
        })

        clearSessionData();
        router.navigate("./Login");
        onDismiss();
      }, (error) => {
        hideLoading()
        showAlert(error);
        setEnviando(false);
      })
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cierre de Caja</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {step === 1 && (

            <BoxCierreCajaPaso1
              totalEfectivo={totalEfectivo}
              setTotalEfectivo={setTotalEfectivo}
              arrayBilletes={arrayBilletes}
              setArrayBilletes={setArrayBilletes}
              hasFocus={visible}
            />
            // <BoxCierreCajaPaso1
            //   totalEfectivo={totalEfectivo}
            //   setTotalEfectivo={setTotalEfectivo}
            //   arrayBilletes={arrayBilletes}
            //   setArrayBilletes={setArrayBilletes}
            //   hasFocus={visible}
            // />
          )}
          {step === 2 && (
            <BoxCierreCajaPaso2
              totalEfectivo={totalEfectivo}
              arrayBilletes={arrayBilletes}
              infoCierre={infoCierre}
              hasFocus={visible}
            />
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 1 && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onDismiss}
              >
                <Text style={styles.buttonText}>Salir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.continueButton]}
                onPress={handleOnNext}
              >
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>
            </>
          )}
          {step === 2 && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={handleOnPrev}
                disabled={enviando}
              >
                <Text style={styles.buttonText}>Previo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.finishButton]}
                onPress={handleOnFinalizar}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Finalizar</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#283048'
  },
  closeButton: {
    padding: 8
  },
  closeText: {
    fontSize: 18,
    color: '#283048'
  },
  content: {
    padding: 16,
    flexGrow: 1
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#dc0808'
  },
  continueButton: {
    backgroundColor: '#283048'
  },
  backButton: {
    backgroundColor: '#283048'
  },
  finishButton: {
    backgroundColor: '#28a745'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default CierreCajaModal;
