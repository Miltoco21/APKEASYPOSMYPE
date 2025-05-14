
// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
// import Validator from '../../Helpers/Validator';
// import AsignarPeso from '../ScreenDialog/AsignarPeso';


// const ProductsItem = ({ item, index, onRefresh = () => {} }) => {
//   const { removeFromSalesData, replaceToSalesData, showConfirm } = useContext(SelectedOptionsContext);
//   // Usamos una única variable para manejar cantidad o peso
//   const [currentValue, setCurrentValue] = useState(item.quantity || item.cantidad);
//   const [isEditing, setIsEditing] = useState(false);
//   // Definimos el label según el tipo de producto
//   const label = item.pesable ? 'peso' : 'cantidad';
//   const [showPesoModal, setShowPesoModal] = useState(false);


//   useEffect(() => {
//     setCurrentValue(item.quantity || item.cantidad);
//   }, []);

//   const handleValueChange = (text) => {
//     // Aquí se actualiza el estado mientras se escribe
//     setCurrentValue(text);
//   };

//   const commitValueChange = () => {
//     // Convertir el valor ingresado a número
//     let numericValue = parseFloat(currentValue);
//     if (isNaN(numericValue) || numericValue === 0) {
//       alert("Debe ingresar un valor correcto");
//       // Reestablecemos el valor anterior en caso de error
//       setCurrentValue(item.quantity || item.cantidad);
//       setIsEditing(false);
//       return;
//     }

//     // Verificar que no termine en punto o coma, similar a la lógica del modal
//     const valueStr = currentValue.toString();
//     const lastChar = valueStr.slice(-1);
//     if (lastChar === '.' || lastChar === ',') {
//       alert("Debe ingresar un valor correcto");
//       setCurrentValue(item.quantity || item.cantidad);
//       setIsEditing(false);
//       return;
//     }

//     // Validar según el tipo de producto
//     if (item.pesable && !Validator.isPeso(currentValue)) {
//       alert("El peso ingresado no es válido");
//       setCurrentValue(item.quantity || item.cantidad);
//       setIsEditing(false);
//       return;
//     }
//     if (!item.pesable && !Validator.isCantidad(currentValue)) {
//       alert("La cantidad ingresada no es válida");
//       setCurrentValue(item.quantity || item.cantidad);
//       setIsEditing(false);
//       return;
//     }

//     // Actualizamos el producto y el estado global
//     item.quantity = numericValue;
//     item.cantidad = numericValue;
//     item.updateSubtotal();
//     replaceToSalesData(index, item);
//     setIsEditing(false);
//   };

//   return (
//     <View style={styles.selectedProductRow}>
//       {isEditing ? (
//         <TextInput
//           style={styles.quantityText}
//           keyboardType="numeric"
//           autoFocus
//           value={String(currentValue)}
//           onChangeText={handleValueChange}
//           onBlur={commitValueChange}
//           placeholder={label}
//         />
//       ) : (
//         <TouchableOpacity onPress={() => setIsEditing(true)}>
//           <Text style={styles.quantityText}>{currentValue}</Text>
//         </TouchableOpacity>
//       )}
//       <Text style={styles.selectedProductText}>
//         {item.nombre || item.description}
//       </Text>
//       <Text style={styles.priceText}>
//         {item.precioVenta ? `$${item.precioVenta}` : '-'}
//       </Text>
//       <Text style={styles.totalText}>
//         {item.precioVenta ? `$${(item.precioVenta * currentValue)}` : '-'}
//       </Text>
//       <TouchableOpacity
//         onPress={() => {
//           showConfirm("¿Eliminar " + item.description + "?", () => {
//             removeFromSalesData(index);
//           });
//         }}
//       >
//         <Ionicons name="trash" size={21} color="#ff4444" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ProductsItem;

// const styles = StyleSheet.create({
//   selectedProductRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   quantityText: {
//     flex: 0.5,
//     fontSize: 10,
//     color: '#333',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     borderWidth: 1,
//     borderRadius: 4,
//     padding: 5,
//     width: 36,
//   },
//   selectedProductText: {
//     flex: 2,
//     fontSize: 8,
//     color: '#333',
//     paddingHorizontal: 4,
//   },
//   priceText: {
//     flex: 1,
//     fontSize: 9,
//     color: '#283048',
//     textAlign: 'right',
//     paddingHorizontal: 4,
//   },
//   totalText: {
//     flex: 1,
//     fontSize: 9,
//     color: '#283048',
//     fontWeight: 'bold',
//     textAlign: 'right',
//     paddingHorizontal: 4,
//   },
// });



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
        {item.precioVenta ? `$${item.precioVenta.toFixed(2)}` : '-'}
      </Text>
      
      <Text style={styles.totalText}>
        {item.precioVenta ? `$${(item.precioVenta * currentValue).toFixed(2)}` : '-'}
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