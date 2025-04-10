// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
// import Validator from '../../Helpers/Validator';

// const ProductsItem = ({ item, index, onRefresh = () => {} }) => {
//   const { removeFromSalesData, replaceToSalesData, showConfirm } = useContext(SelectedOptionsContext);
//   // Usamos una única variable para manejar cantidad o peso
//   const [currentValue, setCurrentValue] = useState(item.quantity || item.cantidad);
//   const [isEditing, setIsEditing] = useState(false);
//   // Definimos el label según el tipo de producto
//   const label = item.pesable ? 'peso' : 'cantidad';

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
//     width: 30,
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
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Validator from '../../Helpers/Validator';

const ProductsItem = ({ item, index, onRefresh = () => {} }) => {
  const { removeFromSalesData, replaceToSalesData, showConfirm } = useContext(SelectedOptionsContext);
  // Usamos una única variable para manejar cantidad o peso
  const [currentValue, setCurrentValue] = useState(item.quantity || item.cantidad);
  const [isEditing, setIsEditing] = useState(false);
  // Definimos el label según el tipo de producto
  const label = item.pesable ? 'peso' : 'cantidad';

  useEffect(() => {
    setCurrentValue(item.quantity || item.cantidad);
  }, []);

  const handleValueChange = (text) => {
    // Aquí se actualiza el estado mientras se escribe
    setCurrentValue(text);
  };

  const commitValueChange = () => {
    // Convertir el valor ingresado a número
    let numericValue = parseFloat(currentValue);
    if (isNaN(numericValue) || numericValue === 0) {
      alert("Debe ingresar un valor correcto");
      // Reestablecemos el valor anterior en caso de error
      setCurrentValue(item.quantity || item.cantidad);
      setIsEditing(false);
      return;
    }

    // Verificar que no termine en punto o coma, similar a la lógica del modal
    const valueStr = currentValue.toString();
    const lastChar = valueStr.slice(-1);
    if (lastChar === '.' || lastChar === ',') {
      alert("Debe ingresar un valor correcto");
      setCurrentValue(item.quantity || item.cantidad);
      setIsEditing(false);
      return;
    }

    // Validar según el tipo de producto
    if (item.pesable && !Validator.isPeso(currentValue)) {
      alert("El peso ingresado no es válido");
      setCurrentValue(item.quantity || item.cantidad);
      setIsEditing(false);
      return;
    }
    if (!item.pesable && !Validator.isCantidad(currentValue)) {
      alert("La cantidad ingresada no es válida");
      setCurrentValue(item.quantity || item.cantidad);
      setIsEditing(false);
      return;
    }

    // Actualizamos el producto y el estado global
    item.quantity = numericValue;
    item.cantidad = numericValue;
    item.updateSubtotal();
    replaceToSalesData(index, item);
    setIsEditing(false);
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
          placeholder={label}
        />
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Text style={styles.quantityText}>{currentValue}</Text>
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
      <TouchableOpacity
        onPress={() => {
          showConfirm("¿Eliminar " + item.description + "?", () => {
            removeFromSalesData(index);
          });
        }}
      >
        <Ionicons name="trash" size={21} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );
};

export default ProductsItem;

const styles = StyleSheet.create({
  selectedProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityText: {
    flex: 0.5,
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    width: 36,
  },
  selectedProductText: {
    flex: 2,
    fontSize: 8,
    color: '#333',
    paddingHorizontal: 4,
  },
  priceText: {
    flex: 1,
    fontSize: 9,
    color: '#283048',
    textAlign: 'right',
    paddingHorizontal: 4,
  },
  totalText: {
    flex: 1,
    fontSize: 9,
    color: '#283048',
    fontWeight: 'bold',
    textAlign: 'right',
    paddingHorizontal: 4,
  },
});
