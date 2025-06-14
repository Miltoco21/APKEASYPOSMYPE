import React, { useContext, useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import BaseConfig, { OrdenListado } from '../definitions/BaseConfig';
import InputName from 'src/Componentes/Elements/CompuestosMobile/InputName';
import InputPage from 'src/Componentes/Elements/CompuestosMobile/InputPage';
import ModelConfig from 'src/Models/ModelConfig';
import Grid from 'src/Componentes/Grid';
import InputCheckboxAutorizar from 'src/Componentes/Elements/CompuestosMobile/InputCheckboxAutorizar';
import InputCheckbox from 'src/Componentes/Elements/CompuestosMobile/InputCheckbox';
import Typography from 'src/Componentes/Typography';
import BoxOptionList from 'src/Componentes/BoxContent/BoxOptionList';
import InputNumber from 'src/Componentes/Elements/CompuestosMobile/InputNumber';
import Log from 'src/Models/Log';
import ImpresoraBluetooth from './ImpresoraBluetooth';
import Box from 'src/Componentes/Box';
import System from 'src/Helpers/System';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';
import MetodosPago from 'src/definitions/MetodosPago';
import BoxOptionListMulti from 'src/Componentes/BoxContent/BoxOptionListMulti';


const BaseConfigModal = ({
  openDialog,
  setOpenDialog,
  onChange,
}) => {


  const {
    setModoAvion
  } = useContext(SelectedOptionsContext);

  const [urlBase, setUrlBase] = useState("")
  const [cantBusqRap, setCantBusqRap] = useState(20);
  const [pedirDatosTransferencia, setPedirDatosTransferencia] = useState(false)
  const [pagarConCuentaCorriente, setPagarConCuentaCorriente] = useState(false)

  const [ordenesMostrarListado, setOrdenesMostrarListado] = useState([])

  const [ordenMostrarListado, setOrdenMostrarListado] = useState(null)
  const [pedirPermisoBorrarProducto, setPedirPermisoBorrarProducto] = useState(false)
  const [permitirVentaPrecio0, setPermitirVentaPrecio0] = useState(false)

  const [agruparProductoLinea, setAgruparProductoLinea] = useState(false)
  const [sucursal, setSucursal] = useState("")
  const [puntoVenta, setPuntoVenta] = useState("")
  const [impresoraBluetooth, setImpresoraBluetooth] = useState("")

  const [showModalPrinter, setShowModalPrinter] = useState(false)
  const [usaImpresora, setUsaImpresora] = useState(false)

  const [emitirBoleta, setEmitirBoleta] = useState(false)
  const [tienePasarelaPago, setTienePasarelaPago] = useState(false)
  const [excluirMediosEnBoleta, setExcluirMediosEnBoleta] = useState([])

  const [mantenerTecladoVisible, setMantenerTecladoVisible] = useState(false)

  const cargarOrdenesListados = () => {
    var seleccionables = []
    const keys = Object.keys(OrdenListado)

    keys.forEach((key, ix) => {
      var idx = OrdenListado[key]
      seleccionables.push({
        id: idx,
        value: key.replaceAll("_", " ")
      })
    })

    setOrdenesMostrarListado(seleccionables)
  }

  const loadConfigs = async () => {
    setUrlBase(await ModelConfig.get("urlBase"))
    setPedirDatosTransferencia(await ModelConfig.get("pedirDatosTransferencia"))
    setPagarConCuentaCorriente(await ModelConfig.get("pagarConCuentaCorriente"))
    setCantBusqRap(await ModelConfig.get("cantidadProductosBusquedaRapida"))

    setSucursal(await ModelConfig.get("sucursal"))
    setPuntoVenta(await ModelConfig.get("puntoVenta"))

    setOrdenMostrarListado(await ModelConfig.get("ordenMostrarListado"))
    setPedirPermisoBorrarProducto(await ModelConfig.get("pedirPermisoBorrarProducto"))
    setPermitirVentaPrecio0(await ModelConfig.get("permitirVentaPrecio0"))
    setAgruparProductoLinea(await ModelConfig.get("agruparProductoLinea"))
    setImpresoraBluetooth(await ModelConfig.get("impresoraBluetooth"))
    setUsaImpresora(await ModelConfig.get("usarImpresoraBluetooth"))

    setEmitirBoleta(await ModelConfig.get("emitirBoleta"))


    setTienePasarelaPago(await ModelConfig.get("tienePasarelaPago"))
    setExcluirMediosEnBoleta(await ModelConfig.get("excluirMediosEnBoleta"))

    setMantenerTecladoVisible(await ModelConfig.get("mantenerTecladoVisible"))
  }


  const handleSave = async () => {
    if (!await ModelConfig.isEqual("emitirBoleta", emitirBoleta)) {
      setModoAvion(!emitirBoleta)
    }

    await ModelConfig.change("urlBase", urlBase);
    await ModelConfig.change("pedirDatosTransferencia", pedirDatosTransferencia)
    await ModelConfig.change("pagarConCuentaCorriente", pagarConCuentaCorriente)
    await ModelConfig.change("cantidadProductosBusquedaRapida", cantBusqRap)
    await ModelConfig.change("ordenMostrarListado", ordenMostrarListado)
    await ModelConfig.change("pedirPermisoBorrarProducto", pedirPermisoBorrarProducto)
    await ModelConfig.change("permitirVentaPrecio0", permitirVentaPrecio0)

    await ModelConfig.change("agruparProductoLinea", agruparProductoLinea)

    await ModelConfig.change("sucursal", sucursal)
    await ModelConfig.change("puntoVenta", puntoVenta)
    await ModelConfig.change("impresoraBluetooth", impresoraBluetooth)
    await ModelConfig.change("usarImpresoraBluetooth", usaImpresora)

    await ModelConfig.change("emitirBoleta", emitirBoleta)

    await ModelConfig.change("tienePasarelaPago", tienePasarelaPago)
    await ModelConfig.change("excluirMediosEnBoleta", excluirMediosEnBoleta)
    await ModelConfig.change("mantenerTecladoVisible", mantenerTecladoVisible)
    onClose()
  };

  const onClose = () => {
    setOpenDialog(false)
  }

  const getNamePrinter = () => {
    const pr = JSON.parse(impresoraBluetooth)
    return pr.name
  }
  useEffect(() => {
    if (!openDialog) return
    loadConfigs()
    cargarOrdenesListados()
  }, [openDialog])


  const pedirPermiso = async (cual, callbackok, callbackwrong) => {

    try {

      const checkResult = await check(cual);
      // console.log("checkResult", checkResult)
      // if (checkResult === RESULTS.UNAVAILABLE) {
      //   console.log("version vieja")
      //   console.log("pidiendo permiso ", cual)
      //   var granted = await PermissionsAndroid.request(
      //     cual,
      //     {
      //       title: 'Permiso ' + cual,
      //       message:
      //         'Se requiere permiso: ' + cual,
      //       buttonNeutral: 'Ask Me Later',
      //       buttonNegative: 'Cancel',
      //       buttonPositive: 'OK',
      //     },
      //   );
      //   console.log("resultado de la solicitud", granted)
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     callbackok()
      //   } else {
      //     callbackwrong(cual + ' denied');
      //   }
      //   return
      // }

      if (checkResult !== RESULTS.GRANTED) {
        const requestResult = await request(cual);
        if (requestResult === RESULTS.GRANTED) {
          // Alert.alert('Camera permission granted');
          callbackok()
        } else {
          callbackwrong()
        }
      }
    } catch (err) {
      System.mostrarError(err)
    }
  }


  const permisosBluetooth = async (quePermiso) => {
    await pedirPermiso(quePermiso, () => { }, async () => {
      // Alert.alert('Se necesita el permiso del bluetooh');
      if (await ModelConfig.get("usarImpresoraBluetooth")) {
        setTimeout(async () => {
          await permisosBluetooth(quePermiso)
        }, 10000);
      }
    })
  }

  const iniciarImpresora = async () => {
    // Alert.alert("iniciarImpresora")
    permisosBluetooth(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT)
    permisosBluetooth(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
    permisosBluetooth(PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE)
  }

  useEffect(() => {
    iniciarImpresora()
  }, [usaImpresora])

  return (
    <Modal
      visible={openDialog}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>


            <Text style={styles.modalTitle}>
              <Ionicons name="settings" size={13} color="#0c3259" /> Configuración
            </Text>

            <Grid>
              <InputPage
                inputState={[urlBase, setUrlBase]}
                label={"Url Base"}
              />
            </Grid>


            <Grid>
              <InputNumber
                inputState={[sucursal, setSucursal]}
                label={"Sucursal"}
              />
            </Grid>

            <Grid>
              <InputNumber
                inputState={[puntoVenta, setPuntoVenta]}
                label={"Caja"}
              />
            </Grid>


            {/* <Grid item xs={12} md={12} lg={12}>
              <InputCheckboxAutorizar
                inputState={[pedirDatosTransferencia, setPedirDatosTransferencia]}
                label={"Pedir datos para pagos con transferencia"}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={12} lg={12}>
              <InputCheckboxAutorizar
                inputState={[pagarConCuentaCorriente, setPagarConCuentaCorriente]}
                label={"Permitir pagar con cuenta corriente"}
              />
            </Grid> */}

            <Grid item xs={12} md={12} lg={12} style={{
              alignContent: "left",
              alignItems: "start",
              // backgroundColor: "red",
              padding: 10,
              marginVertical: 20,
              borderWidth: 1,
              borderRadius: 5
            }}>
              <Text>Emision de Boleta</Text>

              <Grid item xs={12} md={12} lg={12}>
                <InputCheckbox
                  inputState={[emitirBoleta, setEmitirBoleta]}
                  label={"Emitir boleta"}
                />
              </Grid>


              <Grid item xs={12} md={12} lg={12}>
                <InputCheckbox
                  inputState={[tienePasarelaPago, setTienePasarelaPago]}
                  label={"Tiene pasarela de pago"}
                />
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <Text
                  style={{
                    userSelect: "none",
                    fontSize: 19,
                    marginVertical: 10
                  }}>
                  No emitir Boleta en:
                </Text>
                <BoxOptionListMulti
                  optionSelected={excluirMediosEnBoleta}
                  setOptionSelected={setExcluirMediosEnBoleta}
                  options={System.arrayIdValueFromObject(MetodosPago, true)}
                />
              </Grid>
            </Grid>


            <Grid item xs={12} lg={12}>
              <Typography>Orden Listado Productos</Typography>
              <BoxOptionList
                optionSelected={ordenMostrarListado}
                setOptionSelected={(e) => {
                  setOrdenMostrarListado(e)
                }}
                options={ordenesMostrarListado}
              />
            </Grid>

            {/* <Grid item xs={12} md={12} lg={12}>
              <InputCheckbox
                inputState={[mantenerTecladoVisible, setMantenerTecladoVisible]}
                label={"Mantener Teclado Visible"}
              />
            </Grid> */}

            <Grid>
              <InputNumber
                inputState={[cantBusqRap, setCantBusqRap]}
                label={"Cantidad productos busqueda rapida"}
              />
            </Grid>


            {/* <Grid item xs={12} md={12} lg={12}>
              <InputCheckboxAutorizar
                inputState={[pedirPermisoBorrarProducto, setPedirPermisoBorrarProducto]}
                label={"Solicitar permiso para eliminar un producto"}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={6} lg={6}>
              <InputCheckbox
                inputState={[permitirVentaPrecio0, setPermitirVentaPrecio0]}
                label={"Permitir venta con precio 0"}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={12} lg={12}>
              <InputCheckbox
                inputState={[agruparProductoLinea, setAgruparProductoLinea]}
                label={"Agrupar Producto Linea"}
              />
            </Grid> */}


            <Box style={{
              backgroundColor: "#F8F8F8",
              padding: 10,
              borderWidth: 2,
              borderRadius: 10,
              marginTop: 10
            }}>

              <Grid item xs={12} md={12} lg={12}>
                <InputCheckbox
                  inputState={[usaImpresora, setUsaImpresora]}
                  label={"Usar Impresora"}
                />
              </Grid>
              {usaImpresora && (
                <Grid item xs={12} md={12} lg={12}>
                  {impresoraBluetooth != "" ? (
                    <Text style={{
                      fontSize: 18,
                      padding: 5,
                      // backgroundColor:"silver",
                      borderWidth: 1,
                      borderRadius: 4,
                      marginTop: 20,
                      marginBottom: 2
                    }}>Impresora: {getNamePrinter()}</Text>
                  ) : (
                    <Text>Sin asignar</Text>
                  )}
                  <ImpresoraBluetooth
                    visible={showModalPrinter}
                    onConfirm={(infoBluetooth) => {
                      if (infoBluetooth === "") {
                        setImpresoraBluetooth("")
                      } else {
                        setImpresoraBluetooth(JSON.stringify(infoBluetooth))
                      }
                      setShowModalPrinter(false)
                    }}
                    onCancel={() => {
                      setShowModalPrinter(false)
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.modalButton, {
                      backgroundColor: "#EC00E8"
                    }]}
                    onPress={() => {
                      setShowModalPrinter(true)
                    }}
                  >
                    <Text style={styles.buttonText}>CONF. Impresora Bluetetooth</Text>
                  </TouchableOpacity>
                </Grid>
              )}
            </Box>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    // maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0c3259',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    width: 150,
  },
  modalButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    height: 60,
    width: "100%",
    marginTop: 5
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    alignContent: "center",
    margin: "auto"
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4333ff',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#231081',
  },
  activeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20, // Espacio para los botones
  },
});

export default BaseConfigModal;