import React, { useState, useContext, useEffect } from "react";

import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import { StyleSheet, Switch, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";
import InputCheckbox from "./InputCheckbox";


const InputCheckboxAutorizar = ({
  inputState,
  validationState = null,
  withLabel = true,
  fieldName = "check",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  vars = null
}) => {

  const {
    pedirSupervision,
  } = useContext(SelectedOptionsContext);


  const [inputValue, setInputValue] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")

  const checkCambio = (a, b, c) => {
    // pedirSupervision(label, () => {
    setInputValue(!inputValue)
    // })
  }
  return (
    <InputCheckbox
      inputState={[inputValue, checkCambio]}
      validationState={validationState}
      withLabel={withLabel}
      fieldName={fieldName}
      label={label}
    />
  );
};

export default InputCheckboxAutorizar;
