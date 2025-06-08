import React, { useContext, useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert } from 'react-native';


const BoxOptionListMulti = ({
  optionSelected,
  setOptionSelected,
  options = []
}) => {


  const assignSelected = (option) => {
    if (isSelected(option)) {
      var index = optionSelected.indexOf(option);
      if (index !== -1) {
        optionSelected.splice(index, 1);
      }
    } else {
      optionSelected.push(option)
    }
    setOptionSelected([...optionSelected])

  }

  const isSelected = (option) => {
    return optionSelected.includes(option)
  }

  return (
    <View style={styles.container}>
      {options.map((option, ix) => {
        return (
          <TouchableOpacity key={ix}
            id={`${ix}-btn`}
            style={{
              ...{
                height: "60px",
                width: "90%",
                padding: 10,
                borderWidth: 1
              }, ...{
                backgroundColor: (isSelected(parseInt(option.id)) ? "#520987" : "white")
              }
            }}
            onPress={() => assignSelected(parseInt(option.id))}
          >
            <Text style={{
              color: (isSelected(parseInt(option.id)) ? "white" : "black")
            }}>
              {option.value}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View >
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

});



export default BoxOptionListMulti;
