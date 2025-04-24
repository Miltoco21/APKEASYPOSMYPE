

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert } from 'react-native';

const TecladoBilletes = ({
  visible,
  onClose,
  onAmountSelected,
  initialValue = 0,
  maxValue = 10000000,
}) => {
  const [inputValue, setInputValue] = useState(initialValue.toString()); 
   const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (visible) {
      setInputValue(initialValue.toString());
      // Notificamos el valor inicial al padre
      onAmountSelected(initialValue);
    }
  }, [visible, initialValue]);

  const handleDenomination = (amount) => {
    const currentValue = parseInt(inputValue.replace(/\D/g, '') || 0);
    const newValue = currentValue + amount;
    
    if (newValue > maxValue) {
      Alert.alert("Error", "El monto excede el máximo permitido");
      return;
    }
    
    setInputValue(newValue.toString());
  };

  const handleInputChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setInputValue(cleanedText);
  };

  const handleAccept = () => {
    const numericValue = parseInt(inputValue) || 0;
    if (numericValue > 0) {
      onAmountSelected(numericValue);
      onClose();
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.container, { width: screenWidth * 0.9 }]}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={Number(inputValue).toLocaleString()}
            onChangeText={handleInputChange}
            placeholder="Ingrese monto"
            placeholderTextColor="#666"
            autoFocus={true}
            readOnly
          />

          <View style={styles.denominationRow}>
            {[20000, 10000, 5000].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.denominationButton}
                onPress={() => handleDenomination(amount)}
              >
                <Text style={styles.buttonText}>${amount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.denominationRow}>
            {[2000,1000, 500,].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.denominationButton}
                onPress={() => handleDenomination(amount)}
              >
                <Text style={styles.buttonText}>${amount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.denominationRow}>
            {[100,50,10].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.denominationButton}
                onPress={() => handleDenomination(amount)}
              >
                <Text style={styles.buttonText}>${amount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
           
          </View>

          <View style={styles.actionRow}>
      
            
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.buttonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
      
            
      <TouchableOpacity
         style={[styles.actionButton, styles.cancelButton]}
         onPress={onClose}
      >
        <Text style={styles.buttonText}>Cerrar</Text>
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
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    elevation: 5,
  },
  input: {
    height: 60,
    borderColor: '#6b6767',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4f4e4e',
    backgroundColor: '#e1e1e5',
    fontFamily: 'Victor Mono',
  },
  denominationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  denominationButton: {
    width: 98,
    height: 50,
    backgroundColor: '#81E7AF',
    borderWidth: 2,
    borderColor: '#6b6767',
    borderRadius: 10,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c1c1c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#4f4e4e',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Victor Mono',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#e1e1e5',
    borderWidth: 2,
    borderColor: '#6b6767',
  },
  clearButton: {
    backgroundColor: 'red',
    width: 80,
    height: 50,

    borderWidth: 2,
    borderColor: '#6b6767',
    borderRadius: 10,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c1c1c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  acceptButton: {
    backgroundColor: '#2196F3',
     width: 80,
    height: 50,

    borderWidth: 2,
    borderColor: '#6b6767',
    borderRadius: 10,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c1c1c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    width: 80,
    height: 50,
    borderWidth: 2,
    borderColor: '#6b6767',
    borderRadius: 10,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c1c1c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default TecladoBilletes;