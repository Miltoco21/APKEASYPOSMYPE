import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';
import Product from '../Models/Product';
import NewProductModal from '../Modals/NewProductModal'; // Asegúrate de que la ruta sea la correcta

const IngresoPLU = ({ visible, onConfirm, onCancel }) => {
  const { userData, showAlert, addToSalesData } = useContext(SelectedOptionsContext);
  const [inputValue, setInputValue] = useState('');
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [currentPLU, setCurrentPLU] = useState('');
  const [loadingPLU, setLoadingPLU] = useState(false);


  useEffect(() => {
    if (!visible) {
      setInputValue('');
      setLoadingPLU(false);
    }
  }, [visible]);

  // const handleConfirm = async () => {
  //   try {
  //     if (!inputValue) {
  //       showAlert('Error', 'El campo PLU no puede estar vacío');
  //       return;
  //     }
  
  //     if (!/^\d+$/.test(inputValue)) {
  //       showAlert('Error', 'El PLU debe contener solo números');
  //       return;
  //     }
  
  //     const productos = await Product.getInstance().findByCodigoBarras({
  //       codigoProducto: inputValue,
  //       codigoCliente: userData?.codigoCliente || 0
  //     });
  
  //     if (productos?.length > 0) {
  //       addToSalesData(productos[0]);
  //       showAlert('Éxito', 'Producto agregado correctamente');
  //       onConfirm(inputValue);
  //     } else {
  //       // Si el producto no se encuentra, se guarda el PLU y se muestra el modal para crear el nuevo producto
  //       setCurrentPLU(inputValue);
  //       setShowNewProductModal(true);
  //     }
  //   } catch (error) {
  //     showAlert('Error', error.message);
  //     onCancel();
  //   }
  // };

  const handleConfirm = async () => {
    try {
      if (!inputValue) {
        showAlert('Error', 'El campo PLU no puede estar vacío');
        return;
      }
  
      if (!/^\d+$/.test(inputValue)) {
        showAlert('Error', 'El PLU debe contener solo números');
        return;
      }
      setLoadingPLU(true);
      // Mostrar carga mientras se busca el producto
      //showAlert('Buscando...', 'Buscando producto por PLU', false); 
  
      // Ejecutar la búsqueda
      await Product.getInstance().findByCodigoBarras(
        {
          codigoProducto: inputValue,
          codigoCliente: userData?.codigoCliente || 0
        },
        (productos, response) => {
          setLoadingPLU(false);
          if (productos?.length > 0) {
            const producto = productos[0];
            addToSalesData(producto);
            onConfirm(inputValue); // Notificar confirmación exitosa
            showAlert('Éxito', 'Producto agregado correctamente');
          } else {

            setCurrentPLU(inputValue);
            setShowNewProductModal(true);
        
          }
        },
        (error) => {
          setLoadingPLU(false);
          showAlert('Error', `Falló la búsqueda: ${error.message}`);
          onCancel();
        }
      );
  
    } catch (error) {
      showAlert('Error crítico', error.message);
      onCancel();
    }
  };
  // const handleCreateProduct = async (newProductData) => {
  //   try {
  //     const nuevoProducto = {
  //       codigoBarras: currentPLU,
  //       nombre: newProductData.nombre,
  //       precioVenta: parseFloat(newProductData.precio),
  //       tipoStock: '1',
  //       fechaIngreso: new Date().toISOString(),
  //     };

  //     const createdProduct = await Product.getInstance().create(nuevoProducto);
      
  //     addToSalesData(createdProduct);
  //     showAlert('Éxito', 'Producto creado y agregado');
  //     setShowNewProductModal(false);
  //     onConfirm(currentPLU);
      
  //   } catch (error) {
  //     showAlert('Error', 'No se pudo crear el producto');
  //   }
  // };

  const handleCreateProduct = (newProduct) => {
    addToSalesData({
      ...newProduct,
      quantity: 1,
      total: newProduct.price || 0
    });
    showAlert('Éxito', 'Producto creado y agregado');
    setShowNewProductModal(false);
    onConfirm(currentPLU);
  };
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
            <Text style={styles.title}>Ingreso de PLU</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese número PLU"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus={true}
              maxLength={13}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
                disabled={loadingPLU}
              >
                <Icon name="cancel" size={20} color="white" />
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, loadingPLU && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={!inputValue || loadingPLU}
              >
                {loadingPLU ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Icon name="check-circle" size={20} color="white" />
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NewProductModal
        visible={showNewProductModal}
        pluCode={currentPLU}
        onSave={handleCreateProduct}
        onCancel={() => setShowNewProductModal(false)}
        confirmation={true}
        confirmationMessage="Producto no encontrado. ¿Desea agregarlo?"
      />
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
});

export default IngresoPLU;
