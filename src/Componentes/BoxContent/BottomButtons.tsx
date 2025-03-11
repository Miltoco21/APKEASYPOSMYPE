import React, { useContext, useState } from 'react';
import { BottomNavigation, useTheme, } from 'react-native-paper';
import { Platform, StyleSheet, Modal, View, TouchableOpacity, Text,SafeAreaView } from 'react-native';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Ionicons from "@expo/vector-icons/Ionicons";
import BaseConfigModal from 'src/Modals/BaseConfigModal';
import BoxProductoFamilia from '../BoxContent/BoxProductoFamilia';
import BoxBusquedaRapida from './BoxBusquedaRapida';

const BottomButtons = () => {
  const { clearSalesData } = useContext(SelectedOptionsContext);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFamiliasModal, setShowFamiliasModal] = useState(false);
  const [showBusquedaRapidaModal, setShowBusquedaRapidaModal] = useState(false);


  const [index, setIndex] = useState(0);
  const { colors } = useTheme();

  const routes = [
    { key: 'clear', title: 'Limpiar', icon: 'trash' as const },
    { key: 'familias', title: 'Familias', icon: 'shapes' as const },
   { key: 'busquedarapida', title: 'Productos ', icon: 'search' as const},
    { key: 'config', title: 'Ajustes', icon: 'settings' as const },
    // { key: 'ventas', title: 'Ventas', icon: 'cart'as const },
    // { key: 'reportes', title: 'Reportes', icon: 'stats-chart'as const },
    // { key: 'usuarios', title: 'Usuarios', icon: 'people'as const },
    // { key: 'mas', title: 'Más', icon: 'ellipsis-horizontal'as const },
  ];

  const renderScene = BottomNavigation.SceneMap({
    clear: () => null,
    familias: () => null,
    busquedarapida: () => null,
    config: () => null,
    // ventas: () => null,
    // reportes: () => null,
    // usuarios: () => null,
    // mas: () => null,
  });


  return (
    <SafeAreaView style={styles.safeContainer}>
    {/* Contenedor principal: se utiliza flex:1 para ocupar la pantalla completa */}
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
        barStyle={[styles.bar, { backgroundColor: colors.background }]}
        onTabPress={({ route }) => {
          if (route.key === 'clear') {
            clearSalesData();
            setIndex(0);
          } else if (route.key === 'config') {
            setShowSettingsModal(true);
          } else if (route.key === 'familias') {
            setShowFamiliasModal(true);
          }else if (route.key === 'busquedarapida') {
            setShowBusquedaRapidaModal(true);
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
    {/* Modal para Familias */}
    <Modal
      visible={showFamiliasModal}
      animationType="slide"
      onRequestClose={() => setShowFamiliasModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowFamiliasModal(false)}
        >
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
        <BoxProductoFamilia />
      </SafeAreaView>
    </Modal>
    <Modal
        visible={showBusquedaRapidaModal}
        animationType="slide"
        onRequestClose={() => setShowBusquedaRapidaModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowBusquedaRapidaModal(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>

          </TouchableOpacity>
         
          <Text style={{ fontSize: 18, textAlign: 'center', margin: 20 }}>Búsqueda Rápida</Text>

          <BoxBusquedaRapida/>
        </SafeAreaView>
      </Modal>

  </SafeAreaView>
   
  );
};

export default BottomButtons;
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Ubica la barra inferior en la parte baja
  },
  modalContainer: {
    flex: 1,
    padding: 3,
    backgroundColor: '#fff',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  bar: {
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },n: {
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    includeFontPadding: false,
    textAlign: 'center',
  }
});