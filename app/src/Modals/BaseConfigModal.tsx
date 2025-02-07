import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import BaseConfig, { OrdenListado } from '../definitions/BaseConfig';

const BaseConfigModal = ({
  visible,
  onClose,
  config,
  onSave,
}) => {
  const [localConfig, setLocalConfig] = React.useState(config);

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            <Ionicons name="settings" size={24} color="#0c3259" /> Configuración
          </Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>

            {/* URL Base */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>URL del Servidor</Text>
              <TextInput
                style={styles.input}
                value={localConfig.urlBase}
                onChangeText={(text) => setLocalConfig({ ...localConfig, urlBase: text })}
              />
            </View>

            {/* Mostrar botón imprimir */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Mostrar botón imprimir</Text>
              <Switch
                value={localConfig.showPrintButton}
                onValueChange={(value) => setLocalConfig({ ...localConfig, showPrintButton: value })}
              />
            </View>

            {/* Sucursal */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Nombre Sucursal</Text>
              <TextInput
                style={styles.input}
                value={localConfig.sucursalNombre}
                onChangeText={(text) => setLocalConfig({ ...localConfig, sucursalNombre: text })}
              />
            </View>

            {/* Punto de venta */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Nombre Punto Venta</Text>
              <TextInput
                style={styles.input}
                value={localConfig.puntoVentaNombre}
                onChangeText={(text) => setLocalConfig({ ...localConfig, puntoVentaNombre: text })}
              />
            </View>
            {/* Cantidad Productos Búsqueda Rápida*/}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Cantidad Productos Búsqueda Rápida</Text>
              <TextInput
                style={styles.input}
                value={localConfig.cantidadProductosBusquedaRapida}
                onChangeText={(text) => setLocalConfig({ ...localConfig, cantidadProductosBusquedaRapida: text })}
              />
            </View>
            {/* Cantidad Ticket Imprimir */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Cantidad Ticket Imprimir</Text>
              <TextInput
                style={styles.input}
                value={localConfig.cantidadTicketImprimir}
                onChangeText={(text) => setLocalConfig({ ...localConfig, cantidadTicketImprimir: text })}
              />
            </View>
            {/* Orden del Listado */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Orden del Listado</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    localConfig.ordenMostrarListado === OrdenListado.Ascendente &&
                    styles.activeButton
                  ]}
                  onPress={() => setLocalConfig({
                    ...localConfig,
                    ordenMostrarListado: OrdenListado.Ascendente
                  })}
                >
                  <Text style={[
                    styles.buttonText,
                    localConfig.ordenMostrarListado === OrdenListado.Ascendente &&
                    styles.activeButtonText
                  ]}>
                    Ascendente
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    localConfig.ordenMostrarListado === OrdenListado.Descendente &&
                    styles.activeButton
                  ]}
                  onPress={() => setLocalConfig({
                    ...localConfig,
                    ordenMostrarListado: OrdenListado.Descendente
                  })}
                >
                  <Text style={[
                    styles.buttonText,
                    localConfig.ordenMostrarListado === OrdenListado.Descendente &&
                    styles.activeButtonText
                  ]}>
                    Descendente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Mostrar pre venta */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Mostrar Preventa</Text>
              <Switch
                value={localConfig.verBotonPreventa}
                onValueChange={(value) => setLocalConfig({ ...localConfig, verBotonPreventa: value })}
              />
            </View>
            {/* Mostrar pre venta */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Mostrar Boton Envases</Text>
              <Switch
                value={localConfig.verBotonEnvases}
                onValueChange={(value) => setLocalConfig({ ...localConfig, verBotonEnvases: value })}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Mostrar Boton Pagar Factura</Text>
              <Switch
                value={localConfig.verBotonPagarFactura}
                onValueChange={(value) => setLocalConfig({ ...localConfig, verBotonPagarFactura: value })}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Suspender y Recuperar </Text>
              <Switch
                value={localConfig.suspenderYRecuperar}
                onValueChange={(value) => setLocalConfig({ ...localConfig, suspenderYRecuperar: value })}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Pedir datos para pagos con transferencia</Text>
              <Switch
                value={localConfig.pedirDatosTransferencia}
                onValueChange={(value) => setLocalConfig({ ...localConfig, pedirDatosTransferencia: value })}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Solicitar Permiso para eliminar producto</Text>
              <Switch
                value={localConfig.pedirPermisoBorrarProducto}
                onValueChange={(value) => setLocalConfig({ ...localConfig, pedirPermisoBorrarProducto: value })}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Permitir pagar con cuenta corriente</Text>
              <Switch
                value={localConfig.pagarConCuentaCorriente}
                onValueChange={(value) => setLocalConfig({ ...localConfig, pagarConCuentaCorriente: value })}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Permitir venta con precio 0</Text>
              <Switch
                value={localConfig.permitirVentaPrecio0}
                onValueChange={(value) => setLocalConfig({ ...localConfig, permitirVentaPrecio0: value })}
              />
            </View>


            {/* seccion impresion */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Impresion</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Ancho impresora</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig.widthPrint}
                  onChangeText={(text) => setLocalConfig({ ...localConfig, widthPrint: text })}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>Demora entre impresiones (segundos)</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig.delayBetwenPrints}
                  onChangeText={(text) => setLocalConfig({ ...localConfig, delayBetwenPrints: text })}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>Demora cierre ventana (segundos)</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig.delayCloseWindowPrints}
                  onChangeText={(text) => setLocalConfig({ ...localConfig, delayCloseWindowPrintst: text })}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Mostar botones de pruebas </Text>
                <Switch
                  value={localConfig.showPrintButton}
                  onValueChange={(value) => setLocalConfig({ ...localConfig, showPrintButton: value })}
                />
              </View>



            </View>
            {/* seccion balanza */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Balanza</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Código de la Balanza</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig.codBalanza}
                  onChangeText={(text) => setLocalConfig({ ...localConfig, codBalanza: text })}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>Largo del Producto</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig.largoIdProdBalanza}
                  onChangeText={(number) => setLocalConfig({ ...localConfig, largoIdProdBalanza: number })}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>Largo del peso</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig.largoPesoBalanzaVentaUnidad}
                  onChangeText={(text) => setLocalConfig({ ...localConfig, largoPesoBalanzaVentaUnidad: text })}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Digito Peso entero</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig. digitosPesoEnterosBalanza}
                  onChangeText={(text) => setLocalConfig({ ...localConfig,  digitosPesoEnterosBalanza: text })}
                />
              </View>
    



            </View>
             {/* seccion balanza venta por unidades*/}
             <View style={styles.section}>
              <Text style={styles.sectionTitle}>Balanza Venta por unidades</Text>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Código de la Balanza</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig. codBalanzaVentaUnidad}
                  onChangeText={(text) => setLocalConfig({ ...localConfig,  codBalanzaVentaUnidad: text })}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>Largo del Producto</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig. largoIdProdBalanzaVentaUnidad}
                  onChangeText={(number) => setLocalConfig({ ...localConfig, largoIdProdBalanzaVentaUnidad: number })}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>Largo del peso</Text>
                <TextInput
                  style={styles.input}
                  value={localConfig. largoPesoBalanzaVentaUnidad}
                  onChangeText={(text) => setLocalConfig({ ...localConfig,  largoPesoBalanzaVentaUnidad: text })}
                />
              </View>
              
    



            </View>


          </ScrollView>



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
    maxHeight: '80%',
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