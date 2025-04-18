

import React, { useState, useEffect,useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Product from '../Models/Product';
import StorageSesion from '../Helpers/StorageSesion'; // Asegúrate de que la ruta sea correcta
import dayjs from 'dayjs';
import User from "src/Models/User";
import { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';



const NewProductModal = ({
  visible,
  onSave,
  onCancel,
  pluCode,
  confirmation = false,
  confirmationMessage = ''
}) => {

  const { showAlert} = useContext(SelectedOptionsContext);

  const [productData, setProductData] = useState({ nombre: '', precio: '', tipo: 0 });
  const [tipos, setTipos] = useState([]);
  const [showForm, setShowForm] = useState(!confirmation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;

    setProductData({ nombre: '', precio: '', tipo: 0 });
    setShowForm(!confirmation);
    setError('');

    // Cargar tipos de productos
    Product.getInstance().getTipos(
      (response) => setTipos(response),
      () => setTipos([])
    );
  }, [visible, confirmation]);

  const handleConfirmation = (respuesta) => {
    if (respuesta) {
      setShowForm(true);
    } else {
      onCancel();
    }
  };

  // Convierte el valor ingresado a número, permitiendo los formatos con coma o punto
  const parsePrecio = (value) => {
    const cleanedValue = value.replace(/[^0-9.,]/g, '');
    return parseFloat(cleanedValue.replace(',', '.'));
  };

  // const handleSave = async () => {
  //   const { nombre, precio, tipo } = productData;

  //   if (!nombre.trim() || !precio || tipo === 0) {
  //     Alert.alert('Atención', 'Debe completar todos los campos.');
  //     return;
  //   }

  //   const precioNum = parsePrecio(precio);
  //   if (isNaN(precioNum) || precioNum <= 0) {
  //     Alert.alert('Error', 'Precio no válido.');
  //     return;
  //   }

  //   // Obtener los datos de sesión para extraer sucursal y punto de venta
  //   let codigoSucursal, puntoVenta, sesion;
  //   try {
  //     sesion = await StorageSesion.getSession();
  //     if (!sesion) {
  //       Alert.alert("Error de sesión", "No se encontraron datos de sesión.");
  //       return;
  //     }
  //     // Se asume que en la sesión se encuentran las propiedades 'sucursal' y 'puntoVenta'
  //     codigoSucursal = Number(sesion.sucursal);
  //     puntoVenta = String(sesion.puntoVenta);
  //   } catch (err) {
  //     Alert.alert("Error de Configuración", "No se pudo obtener la configuración de sesión.");
  //     return;
  //   }

  //   // Crear objeto conforme al nuevo esquema esperado por el servidor
  //   const product = {
  //     codSacanner: pluCode,                   // Se utiliza el PLU como identificador (puede ser nulo o string)
  //     codigoSucursal: codigoSucursal,         // Número obtenido de la sesión
  //     puntoVenta: puntoVenta,                 // String obtenido de la sesión
  //     fechaIngreso: dayjs().toISOString(),    // Fecha actual en formato ISO
  //     nombre: nombre.trim(),                  // Nombre del producto
  //     precioVenta: precioNum,                 // Precio (como número)
  //     tipoVenta: tipo                         // Tipo del producto
  //   };

  //   setLoading(true);
  //   setError('');

  //   try {
  //     await new Promise((resolve, reject) => {
  //       Product.getInstance().newProductFromCode(
  //         product,
  //         (responseData) => {
  //           resolve(responseData);
  //           onSave({
  //             ...product,
  //             idProducto: responseData.idProducto,
  //           });
  //         },
  //         (error) => {
  //           let errorMessage = 'Error al guardar el producto';
  //           if (error.response?.data?.message) {
  //             errorMessage = error.response.data.message;
  //           }
  //           reject(new Error(errorMessage));
  //         }
  //       );
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async () => {
    const { nombre, precio, tipo } = productData;
  
    if (!nombre.trim() || !precio || tipo === 0) {
      showAlert('Atención', 'Debe completar todos los campos.');
      return;
    }
  
    const precioNum = parsePrecio(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      showAlert('Error', 'Precio no válido.');
      return;
    }
  
    let codigoSucursal, puntoVenta, sesion;
    try {
      // Obtener sesión usando la instancia de User
      const us = User.getInstance();
      sesion = await us.getFromSesion();
      
      if (!sesion) {
        showAlert("Error de sesión", "No se encontraron datos de sesión.");
        return;
      }
      
      // Extraer valores correctos desde la sesión
      codigoSucursal = Number(sesion.codigoSucursal); // Corregido: usar camelCase
      puntoVenta = String(sesion.puntoVenta);
      
      console.log("Datos de sesión:", sesion); // Para depuración
      
    } catch (err) {
      showAlert("Error de sesión", "No se pudo obtener la configuración de sesión: " + err.message);
      return;
    }
  
    // Crear objeto del producto
    const product = {
      codSacanner: pluCode,
      codigoSucursal: codigoSucursal,    // Usar valor obtenido de la sesión
      puntoVenta: puntoVenta,            // Usar valor obtenido de la sesión
      fechaIngreso: dayjs().toISOString(),
      nombre: nombre.trim(),
      precioVenta: precioNum,
      tipoVenta: tipo
    };
  
    setLoading(true);
    setError('');
  
    try {
      await new Promise((resolve, reject) => {
        Product.getInstance().newProductFromCode(
          product,
          (responseData) => {
            onSave({
              ...product,
              idProducto: responseData.idProducto,
            });
            resolve(responseData);
          },
          (error) => {
            const errorMessage = error.response?.data?.message || 'Error al guardar el producto';
            reject(new Error(errorMessage));
          }
        );
      });
    } catch (err) {
      setError(err.message);
      showAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {confirmation && !showForm ? (
            <>
              <Text style={styles.confirmationText}>{confirmationMessage}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handleConfirmation(false)}
                  disabled={loading}
                >
                  <Icon name="cancel" size={20} color="white" />
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => handleConfirmation(true)}
                  disabled={loading}
                >
                  <Icon name="check-circle" size={20} color="white" />
                  <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Nuevo Producto - PLU: {pluCode}</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Nombre del producto"
                value={productData.nombre}
                onChangeText={(text) => setProductData({ ...productData, nombre: text })}
                editable={!loading}
              />

              <TextInput
                style={styles.input}
                placeholder="Precio"
                keyboardType="decimal-pad"
                value={productData.precio}
                onChangeText={(text) => setProductData({ ...productData, precio: text })}
                editable={!loading}
              />

              <Picker
                selectedValue={productData.tipo}
                onValueChange={(itemValue) =>
                  setProductData({ ...productData, tipo: itemValue })
                }
                enabled={!loading}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione tipo de producto" value={0} />
                {tipos.map((tipo) => (
                  <Picker.Item key={tipo.idTipo} label={tipo.descripcion} value={tipo.idTipo} />
                ))}
              </Picker>

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
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Icon name="save" size={20} color="white" />
                      <Text style={styles.buttonText}>Guardar</Text>
                    </>
                  )}
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
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#283048',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default NewProductModal;
