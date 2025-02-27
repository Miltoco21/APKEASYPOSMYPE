import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
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

const BaseConfigModal = ({
  openDialog,
  setOpenDialog,
  onChange,
}) => {
  const [urlBase, setUrlBase] = useState("")

  const [pedirDatosTransferencia, setPedirDatosTransferencia] = useState(false)
  const [pagarConCuentaCorriente, setPagarConCuentaCorriente] = useState(false)

  const [ordenesMostrarListado, setOrdenesMostrarListado] = useState([])

  const [ordenMostrarListado, setOrdenMostrarListado] = useState(null)
  const [pedirPermisoBorrarProducto, setPedirPermisoBorrarProducto] = useState(false)
  const [permitirVentaPrecio0, setPermitirVentaPrecio0] = useState(false)

  const [agruparProductoLinea, setAgruparProductoLinea] = useState(false)
  const [sucursal, setSucursal] = useState("")
  const [puntoVenta, setPuntoVenta] = useState("")


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
    
    setSucursal(await ModelConfig.get("sucursal"))
    setPuntoVenta(await ModelConfig.get("puntoVenta"))

    setOrdenMostrarListado(await ModelConfig.get("ordenMostrarListado"))
    setPedirPermisoBorrarProducto(await ModelConfig.get("pedirPermisoBorrarProducto"))
    setPermitirVentaPrecio0(await ModelConfig.get("permitirVentaPrecio0"))
    setAgruparProductoLinea(await ModelConfig.get("agruparProductoLinea"))
  }

  const handleSave = async () => {
    await ModelConfig.change("urlBase", urlBase);
    await ModelConfig.change("pedirDatosTransferencia", pedirDatosTransferencia)
    await ModelConfig.change("pagarConCuentaCorriente", pagarConCuentaCorriente)

    await ModelConfig.change("ordenMostrarListado", ordenMostrarListado)
    await ModelConfig.change("pedirPermisoBorrarProducto", pedirPermisoBorrarProducto)
    await ModelConfig.change("permitirVentaPrecio0", permitirVentaPrecio0)

    await ModelConfig.change("agruparProductoLinea", agruparProductoLinea)
    
    await ModelConfig.change("sucursal", sucursal)
    await ModelConfig.change("puntoVenta", puntoVenta)

    setOpenDialog(false);
  };

  const onClose = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    loadConfigs()
    cargarOrdenesListados()
  }, [openDialog])

  return (
    <Modal
      visible={openDialog}
      transparent={true}
      animationType="slide"
      onRequestClose={() => { onClose }}
    >
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


          <Grid item xs={12} md={12} lg={12}>
            <InputCheckboxAutorizar
              inputState={[pedirDatosTransferencia, setPedirDatosTransferencia]}
              label={"Pedir datos para pagos con transferencia"}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <InputCheckboxAutorizar
              inputState={[pagarConCuentaCorriente, setPagarConCuentaCorriente]}
              label={"Permitir pagar con cuenta corriente"}
            />
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


          <Grid item xs={12} md={12} lg={12}>
            <InputCheckboxAutorizar
              inputState={[pedirPermisoBorrarProducto, setPedirPermisoBorrarProducto]}
              label={"Solicitar permiso para eliminar un producto"}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <InputCheckbox
              inputState={[permitirVentaPrecio0, setPermitirVentaPrecio0]}
              label={"Permitir venta con precio 0"}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[agruparProductoLinea, setAgruparProductoLinea]}
              label={"Agrupar Producto Linea"}
            />
          </Grid>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
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
  }, section: {
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