import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NewProductModal = ({
  visible,
  onSave,
  onCancel,
  pluCode,
  confirmation = false,
  confirmationMessage = ''
}) => {
  const [productData, setProductData] = useState({ nombre: '', precio: '' });
  const [showForm, setShowForm] = useState(!confirmation);

  useEffect(() => {
    if (!visible) {
      setProductData({ nombre: '', precio: '' });
      setShowForm(!confirmation);
    }
  }, [visible, confirmation]);

  const handleConfirmation = (respuesta) => {
    if (respuesta) {
      setShowForm(true);
    } else {
      onCancel();
    }
  };

  const handleSave = () => {
    if (!productData.nombre || !productData.precio) {
      alert('Complete todos los campos');
      return;
    }
    onSave({ ...productData, codigoBarras: pluCode });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {confirmation && !showForm ? (
            <>
              <Text style={styles.confirmationText}>
                {confirmationMessage}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handleConfirmation(false)}
                >
                  <Icon name="cancel" size={20} color="white" />
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => handleConfirmation(true)}
                >
                  <Icon name="check-circle" size={20} color="white" />
                  <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Nuevo Producto - PLU: {pluCode}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del producto"
                value={productData.nombre}
                onChangeText={(text) =>
                  setProductData({ ...productData, nombre: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Precio"
                keyboardType="numeric"
                value={productData.precio}
                onChangeText={(text) =>
                  setProductData({ ...productData, precio: text })
                }
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                >
                  <Icon name="cancel" size={20} color="white" />
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleSave}
                >
                  <Icon name="save" size={20} color="white" />
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '48%',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
});

export default NewProductModal;
