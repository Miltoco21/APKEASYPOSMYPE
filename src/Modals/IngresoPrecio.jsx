import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';
import Product from '../Models/Product';
import Log from 'src/Models/Log';


const IngresoPrecio = ({ visible, product, onConfirm, onCancel }) => {
  const { showAlert } = useContext(SelectedOptionsContext);
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && product) {
      setNuevoPrecio(product.precioVenta|| '');
    }
  }, [visible, product]);

  const handleConfirmar = async () => {
    if (!product) return;
    
    const precioNumerico = parseFloat(nuevoPrecio);
   
    
    if (precioNumerico <= 0) {
      showAlert('Error', 'El precio debe ser mayor a cero');
      return;
    }

    try {
      setLoading(true);
      const productoActualizado = {
        ...product,
        precioVenta: precioNumerico
      };

      await Product.getInstance().assignPrice(productoActualizado,
        (response) => {
          setLoading(false);
          showAlert('Éxito', 'Precio actualizado correctamente');
          onConfirm(productoActualizado);
        },
        (error) => {
          console.log(error.message);
          
          setLoading(false);
          showAlert('Error', `Error al actualizar precio: ${error.message}`);
          onCancel();
        }
      );
      
    } catch (error) {
      setLoading(false);
      showAlert('Error', error.message);
      onCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Asignar Precio</Text>
          <Text style={styles.ingresoMonto}>Ingrese el monto del Producto</Text>
          <Text style={styles.productoInfo}>
            {product?.nombre} - {product?.codigoBarras}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nuevo precio"
            keyboardType="numeric"
            value={nuevoPrecio}
            onChangeText={setNuevoPrecio}
            autoFocus={true}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Icon name="cancel" size={20} color="white" />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, loading && styles.disabledButton]}
              onPress={handleConfirmar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Icon name="attach-money" size={20} color="white" />
                  <Text style={styles.buttonText}>Actualizar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
  productoInfo: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  ingresoMonto: {
    fontSize: 14,
    marginBottom: 10,
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
    backgroundColor: '#2980b9',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default IngresoPrecio;