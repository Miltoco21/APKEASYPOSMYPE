import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Validator from '../../Helpers/Validator';
import AsignarPeso from '../ScreenDialog/AsignarPeso';

const ProductsItem = ({ item, index, onRefresh = () => {} }) => {
  const { removeFromSalesData, replaceToSalesData, showConfirm } = useContext(SelectedOptionsContext);
  const [currentValue, setCurrentValue] = useState(item.quantity || item.cantidad);
  const [isEditing, setIsEditing] = useState(false);
  const [showPesoModal, setShowPesoModal] = useState(false);

  useEffect(() => {
    setCurrentValue(item.quantity || item.cantidad);
  }, []);

  const handleValueChange = (text) => {
    setCurrentValue(text);
  };

  const commitValueChange = () => {
    let numericValue = parseFloat(currentValue);
    
    if (isNaN(numericValue)) {
      alert("Valor incorrecto");
      setCurrentValue(item.quantity || item.cantidad);
      setIsEditing(false);
      return;
    }

    if (item.pesable ? !Validator.isPeso(currentValue) : !Validator.isCantidad(currentValue)) {
      alert(`Valor de ${item.pesable ? 'peso' : 'cantidad'} inválido`);
      setCurrentValue(item.quantity || item.cantidad);
      setIsEditing(false);
      return;
    }

    item.quantity = numericValue;
    item.cantidad = numericValue;
    item.updateSubtotal();
    replaceToSalesData(index, item);
    setIsEditing(false);
  };

  const handlePesoChange = (newPeso) => {
    item.quantity = newPeso;
    item.cantidad = newPeso;
    item.updateSubtotal();
    replaceToSalesData(index, item);
    setCurrentValue(newPeso);
  };

  const handleValuePress = () => {
    if (item.pesable) {
      console.log("ocultando teclado product item")
      Keyboard.dismiss();
      setShowPesoModal(true);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.selectedProductRow}>
      {isEditing ? (
        <TextInput
          style={styles.quantityText}
          keyboardType="numeric"
          autoFocus
          value={String(currentValue)}
          onChangeText={handleValueChange}
          onBlur={commitValueChange}
          placeholder={item.pesable ? 'kg' : 'cantidad'}
        />
      ) : (
        <TouchableOpacity onPress={handleValuePress}>
          <Text style={styles.quantityText}>
            {currentValue}
            {item.pesable ? ' kg' : ''}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.selectedProductText}>
        {item.nombre || item.description}
      </Text>
      
      <Text style={styles.priceText}>
        {item.precioVenta ? `$${item.precioVenta}` : '-'}
      </Text>
      
      <Text style={styles.totalText}>
        {item.precioVenta ? `$${(item.precioVenta * currentValue)}` : '-'}
      </Text>
      
      <TouchableOpacity onPress={() => {
        showConfirm("¿Eliminar " + item.description + "?", () => {
          removeFromSalesData(index);
        });
      }}>
        <Ionicons name="trash" size={21} color="#ff4444" />
      </TouchableOpacity>

      <AsignarPeso
        visible={showPesoModal}
        onClose={() => setShowPesoModal(false)}
        product={item}
        currentWeight={currentValue}
        onSave={handlePesoChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectedProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityText: {
    minWidth: 50,
    textAlign: 'center',
    color: '#666',
  },
  selectedProductText: {
    flex: 2,
    paddingHorizontal: 5,
  },
  priceText: {
    minWidth: 70,
    textAlign: 'right',
  },
  totalText: {
    minWidth: 90,
    textAlign: 'right',
    marginRight: 10,
  },
});

export default ProductsItem;