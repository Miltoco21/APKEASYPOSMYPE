import React, { useState, useContext, useEffect } from "react";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import { StyleSheet, Switch, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";

const InputCheckbox = ({
  inputState,
  validationState = null,
  withLabel = true,
  fieldName = "check",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  vars = null
}) => {

  const [inputValue, setInputValue] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")

  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      backgroundColor: "#F8F8F8",
    }}>
      {withLabel && (
        <View style={{
          margin: 0,
          padding: 0,
          width: "80%"
        }}>
          <TouchableOpacity onPress={()=>{ setInputValue(!inputValue) }} style={{
          }}>
            <Text style={{
              paddingHorizontal: 2,
              paddingVertical: 15,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{
        width: "20%"
      }}>
        <Switch
          value={inputValue}
          onValueChange={()=>{ setInputValue(!inputValue) }}
        />
      </View>
    </View>
  );
};

export default InputCheckbox;
