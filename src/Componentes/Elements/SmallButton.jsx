
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import ModelConfig from '../../Models/ModelConfig';
import Colors from '../Colores/Colores';

const SmallButton = ({
  textButton,
  actionButton = () => {},
  style = {},
  isDisabled = false,
  withDelay = true,
  onTouchStart = () => {},
  onTouchEnd = () => {},
  onTouchMove = () => {},
  animateBackgroundColor = false,
}) => {
  const [clickeable, setClickeable] = useState(true);
  const [colorFondo, setColorFondo] = useState(Colors.azul);

  const changeBackgroundColor = () => {
    setColorFondo("#0dee8e");
    setTimeout(() => {
      setColorFondo(Colors.azul);
    }, 1000);
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.button, { backgroundColor: colorFondo }, style]}
      onPress={() => {
        if (!clickeable) {
          return;
        }
        actionButton();
        if (withDelay) {
          setClickeable(false);
          setTimeout(() => {
            setClickeable(true);
          }, ModelConfig.getInstance().getFirst().buttonDelayClick);
        }
        if (animateBackgroundColor) {
          changeBackgroundColor();
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <Text style={styles.buttonText}>{textButton}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // button: {
  //   width: 130,
  //   margin: 5,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 10,
  //   borderRadius: 4,
  // },
  button:{
    // width: "100%",
    // minHeight: 80,
    backgroundColor: "#465379",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SmallButton;
