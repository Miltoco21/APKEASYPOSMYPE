// import React, { useContext, useState, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
// import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
// import Log from 'src/Models/Log';

// const denominations = [20000, 10000, 5000, 2000, 1000, 500, 100, 50, 10];

// const BoxCierreCajaPaso1 = ({ totalEfectivo, setTotalEfectivo, hasFocus }) => {
//   const { userData, grandTotal } = useContext(SelectedOptionsContext);
  
//   const [quantities, setQuantities] = useState({});
//   const inputsRef = {};

//   useEffect(() => {
//     if (!hasFocus) return;
//     calculateTotal();
//   }, [quantities, hasFocus]);

//   const handleQuantityChange = (denomination, value) => {
//     const numericValue = parseInt(value) || 0;
//     setQuantities(prev => ({
//       ...prev,
//       [denomination]: numericValue
//     }));
//   };

//   const calculateTotal = () => {
//     let total = 0;
//     Object.entries(quantities).forEach(([deno, qty]) => {
//       total += parseInt(deno) * (qty || 0);
//     });
//     setTotalEfectivo(total);
//   };

//   const focusNext = (currentDeno) => {
//     const currentIndex = denominations.indexOf(currentDeno);
//     if (currentIndex < denominations.length - 1) {
//       const nextDeno = denominations[currentIndex + 1];
//       inputsRef[nextDeno]?.focus();
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.inputsContainer}>
//         {denominations.map((deno, index) => (
//           <View key={deno} style={styles.inputRow}>
//             <Text style={styles.label}>${deno}</Text>
//             <TextInput
//               ref={ref => (inputsRef[deno] = ref)}r
//               style={styles.input}
//               keyboardType="number-pad"
//               value={quantities[deno]?.toString() || ''}
//               onChangeText={text => handleQuantityChange(deno, text)}
//               onSubmitEditing={() => focusNext(deno)}
//               returnKeyType={index === denominations.length - 1 ? 'done' : 'next'}
//             />
//              <TextInput
              
//             />
//           </View>
//         ))}
//       </View>
      
//       <Text style={styles.totalText}>
//         Total efectivo: ${totalEfectivo}
//       </Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   inputsContainer: {
//     marginBottom: 20,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: 8,
//     paddingHorizontal: 12,
//   },
//   label: {
//     fontSize: 16,
//     color: '#333',
//     flex: 1,
//     marginRight: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     width: 120,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   totalText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#e1213b',
//     textAlign: 'right',
//     marginTop: 20,
//     paddingRight: 12,
//   },
// });

// export default BoxCierreCajaPaso1;

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Log from 'src/Models/Log';

const denominations = [20000, 10000, 5000, 2000, 1000, 500, 100, 50, 10];

const BoxCierreCajaPaso1 = ({ totalEfectivo, setTotalEfectivo, setArrayBilletes, hasFocus  }) => {
  const { userData, grandTotal } = useContext(SelectedOptionsContext);
  
  const [quantities, setQuantities] = useState({});
  const inputsRef = {};

  useEffect(() => {
    if (!hasFocus) return;
    calculateTotal();
  }, [quantities, hasFocus]);

  const handleQuantityChange = (denomination, value) => {
    const numericValue = parseInt(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [denomination]: numericValue
    }));
  };
  const calculateTotal = () => {
    let total = 0;
    const detalles = [];
    Object.entries(quantities).forEach(([deno, qty]) => {
      const cantidad = parseInt(qty) || 0;
      total += parseInt(deno) * cantidad;
      if (cantidad > 0) {
        detalles.push({
          denomination: parseInt(deno),
          quantity: cantidad,
          subtotal: parseInt(deno) * cantidad,
        });
      }
    });
    setTotalEfectivo(total);
    // Actualiza el estado en el componente padre
    if (typeof setArrayBilletes === 'function') {
      setArrayBilletes(detalles);
    }
  };

  const focusNext = (currentDeno) => {
    const currentIndex = denominations.indexOf(currentDeno);
    if (currentIndex < denominations.length - 1) {
      const nextDeno = denominations[currentIndex + 1];
      inputsRef[nextDeno]?.focus();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputsContainer}>
        {denominations.map((deno, index) => (
          <View key={deno} style={styles.inputRow}>
            <Text style={styles.label}>${deno}</Text>
            <TextInput
              ref={ref => (inputsRef[deno] = ref)}
              style={styles.inputCantidad}
              keyboardType="number-pad"
              value={quantities[deno]?.toString() || ''}
              onChangeText={text => handleQuantityChange(deno, text)}
              onSubmitEditing={() => focusNext(deno)}
              returnKeyType={index === denominations.length - 1 ? 'done' : 'next'}
            />
            <TextInput
              style={styles.input}
              value={
                quantities[deno]
                  ? (quantities[deno] * deno).toString()
                  : ''
              }
              editable={false} // Solo lectura
              multiline
             
            />
          </View>
        ))}
      </View>
      
      <Text style={styles.totalText}>
        Total efectivo: ${totalEfectivo}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  inputsContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  inputCantidad: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: 45,
    fontSize: 16,
    textAlign: 'center',
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: 100,
    fontSize: 16,
    textAlign: 'center',
    marginRight: 10,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e1213b',
    textAlign: 'right',
    marginTop: 20,
    paddingRight: 12,
  },
});

export default BoxCierreCajaPaso1;



