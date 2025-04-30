import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';
import Product from '../Models/Product';
import NewProductModal from './NewProductModal'; // Asegúrate de que la ruta sea la correcta
import BluAdmin from '@/Pages/BluAdmin';

const ImpresoraBluetooth = ({ visible, onConfirm, onCancel }) => {
  const {
    userData,
    showAlert,
    addToSalesData
  } = useContext(SelectedOptionsContext);



  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <BluAdmin onSave={(info)=>{
              onConfirm(info)
            }}
            onCancel={()=>{
              onCancel()
            }} 
            />
          </View>
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
  },

});

export default ImpresoraBluetooth;
