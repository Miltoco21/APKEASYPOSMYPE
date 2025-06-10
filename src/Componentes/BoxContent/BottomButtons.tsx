import React, { useContext, useState } from 'react';
import { BottomNavigation, useTheme, } from 'react-native-paper';
import { Platform, StyleSheet, Modal, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Ionicons from "@expo/vector-icons/Ionicons";
import BaseConfigModal from 'src/Modals/ConfigModal';
import BoxProductoFamilia from '../BoxContent/BoxProductoFamilia';
import BoxBusquedaRapida from './BoxBusquedaRapida';
import CerrarCajaModal from '../../Modals/CerrarCajaModal'

const BottomButtons = () => {
  const {
    salesData,
    clearSalesData,
    showAlert,showConfirm
  } = useContext(SelectedOptionsContext);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFamiliasModal, setShowFamiliasModal] = useState(false);
  const [showBusquedaRapidaModal, setShowBusquedaRapidaModal] = useState(false);
  const [showShowCerrarCaja, setShowShowCerrarCaja] = useState(false);



  const [index, setIndex] = useState(0);
 

  const routes = [
    { key: 'clear', title: 'Limpiar', icon: 'trash' as const },
    { key: 'familias', title: 'Familias', icon: 'shapes' as const },
    { key: 'busquedarapida', title: 'Busqueda R.', icon: 'search' as const },
    { key: 'config', title: 'Ajustes', icon: 'settings' as const },
    { key: 'cerrar', title: 'Cierre caja', icon: 'log-out' as const },
    // { key: 'reportes', title: 'Reportes', icon: 'stats-chart'as const },
    // { key: 'usuarios', title: 'Usuarios', icon: 'people'as const },
    // { key: 'mas', title: 'Más', icon: 'ellipsis-horizontal'as const },
  ];

  const renderScene = BottomNavigation.SceneMap({
    clear: () => null,
    familias: () => null,
    busquedarapida: () => null,
    config: () => null,
    cerrar: () => null,
    // reportes: () => null,
    // usuarios: () => null,
    // mas: () => null,
  });

  const renderModalHeader = (title: string, onClose: () => void) => (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>{title}</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );



  return (
    <View style={styles.safeContainer} >


      <View style={styles.container}>

        {/* Si tuvieras otro contenido principal, puedes agregarlo aquí */}
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          renderIcon={({ route, color, focused }) => (
            <Ionicons name={route.icon} size={24} color={focused ? "#283048" : color} />
          )}
          shifting={false}
          //barStyle={[styles.bar, { backgroundColor: colors.background }]}
          onTabPress={({ route }) => {
            if (route.key === 'clear') {
              if (salesData.length < 1) {
                showAlert("No hay elementos en la lista")
                return
              }
              showConfirm(
                "¿Eliminar todos los elementos?", 
                () => {
                  // Si confirman
                  clearSalesData();
                  setIndex(0);
                },
                () => {
                  // Si cancelan
                  console.log("Eliminación cancelada");
                }
              );
            } else if (route.key === 'config') {
              setShowSettingsModal(true);
            } else if (route.key === 'familias') {
              setShowFamiliasModal(true);
            } else if (route.key === 'busquedarapida') {
              setShowBusquedaRapidaModal(true);
            } else if (route.key === 'cerrar') {
              setShowShowCerrarCaja(true);
            }
          }}
        />
      </View>
      {/* Modal para la configuración */}
      <BaseConfigModal
        openDialog={showSettingsModal}
        setOpenDialog={setShowSettingsModal}
        onChange={() => {
          console.log("cambio algo de la config");
        }}
      />
      <CerrarCajaModal
        visible={showShowCerrarCaja}
        onDismiss={() => { setShowShowCerrarCaja(false) }} />
      {/* Modal para Familias */}
      <Modal
        visible={showFamiliasModal}
        animationType="slide"
        onRequestClose={() => setShowFamiliasModal(false)}
      >
        <SafeAreaView style={styles.modalSafeContainer}>
          {renderModalHeader("Búsqueda por Familias", () => setShowFamiliasModal(false))}
          <View style={styles.modalContent}>
            <BoxProductoFamilia />
          </View>
        </SafeAreaView>
      </Modal>


      <Modal
        visible={showBusquedaRapidaModal}
        animationType="slide"
        onRequestClose={() => setShowBusquedaRapidaModal(false)}
      >
         <SafeAreaView style={styles.modalSafeContainer}>
          {renderModalHeader("Búsqueda Rápida", () => setShowBusquedaRapidaModal(false))}
          <View style={styles.modalContent}>
            <BoxBusquedaRapida />
          </View>
        </SafeAreaView>

      </Modal>



    </View>

  );
};

export default BottomButtons;

const styles = StyleSheet.create({
  safeContainer: {
  flex:1,
    backgroundColor: '#fff',
   
  },
  modalSafeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    height: 80, // Alto fijo para el contenedor de navegación
    justifyContent: 'flex-end', // Alinea la navegación al fondo
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8, // Sombras para Android
    shadowColor: '#000', // Sombras para iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,



  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',

  },
  

  modalContent: {
    flex: 1,

  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },


  modalContainer: {

    flex: 1,


    backgroundColor: '#fff',
  },
  closeButton: {
    
   // alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  bar: {

    // height: Platform.OS === 'ios' ? 85 : 65,
    //paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    elevation: 8,
    shadowColor: '#000',
   
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // borderTopWidth: 0.1,
    //borderTopColor: 'rgba(0,0,0,0.1)',
  }, n: {
    marginTop: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    includeFontPadding: false,
    textAlign: 'center',
  }
});