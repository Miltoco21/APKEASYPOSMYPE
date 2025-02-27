import React, { useState, useContext, useEffect } from "react";

import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import Validator from "../../../Helpers/Validator";
import { TextInput } from "react-native-paper";
import { Text } from "react-native";


const InputName = ({
  inputState,
  validationState = null,
  withLabel = true,
  autoFocus = false,
  fieldName = "name",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  canAutoComplete = false,
  maxLength = 20,
  required = false,
  vars = null,
  onEnter = () => { }
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [name, setName] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)
  const [keyPressed, setKeyPressed] = useState(false)

  const validate = () => {
    // console.log("validate de:" + fieldName)
    const len = name.length
    // console.log("len:", len)
    const reqOk = (!required || (required && len > 0))
    var badMinlength = false
    var badMaxlength = false

    if (minLength && len < minLength) {
      badMinlength = true
    }

    if (maxLength && len > maxLength) {
      badMaxlength = true
    }

    var message = ""
    if (!reqOk) {
      message = fieldName + ": es requerido."
    } else if (badMinlength) {
      message = fieldName + ": debe tener " + minLength + " caracteres o mas."
    } else if (badMaxlength) {
      message = fieldName + ": debe tener " + maxLength + " caracteres o menos."
    }

    const vl = {
      "badMinlength": badMinlength,
      "badMaxlength": badMaxlength,
      "require": !reqOk,
      "empty": len == 0,
      "allOk": (reqOk && !badMinlength && !badMaxlength),
      "message": message
    }
    // console.log("vale:", vl)
    setValidation(vl)
  }
  const checkKeyDown = (event) => {
    if (!canAutoComplete && event.key == "Unidentified") {
      event.preventDefault();
      return false
    } else {
      setKeyPressed(true)
    }

    if (event.key == "Enter") {
      onEnter()
    }
  }

  const checkChange = (event) => {
    if (!canAutoComplete && !keyPressed) {
      return
    }
    const value = event.target.value
    if (value == " ") {
      showMessage("Valor erroneo")
      return false
    }
    if (Validator.isNombre(value)) {
      // console.log(value + " es valido")
      setName(value);
    } else {
      // console.log("es incorrecta")
      showMessage("Valor erroneo")

    }
  }

  const checkChangeBlur = (event) => {
    if (name.substr(-1) == " ") {
      setName(name.trim())
    }
  }

  useEffect(() => {
    // console.log("cambio inputState")
    // console.log(inputState)
    validate()
  }, [])


  useEffect(() => {
    // console.log("cambio name")
    // console.log(name)
    validate()
  }, [name])

  return (
    <>
      {withLabel && (
        <Text>
          {label}
        </Text>
      )}
      <TextInput
        fullWidth
        autoFocus={autoFocus}
        margin="normal"
        required={required}
        type="text"
        label={label}
        value={name}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}
      />
    </>
  );
};

export default InputName;
