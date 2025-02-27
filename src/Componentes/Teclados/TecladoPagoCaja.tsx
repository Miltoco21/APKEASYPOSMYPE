import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const TecladoPagoCaja = ({
  showFlag,
  varValue,
  varChanger,
  onEnter,
  onChange = null,
  maxValue = 10000000,
  esPrimeraTecla = null
}) => {
  const [primeraTecla, setPrimeraTecla] = useState(true);
  const { showMessage } = useContext(SelectedOptionsContext);

  useEffect(() => {
    if (esPrimeraTecla === true || esPrimeraTecla === false) {
      setPrimeraTecla(esPrimeraTecla);
    }
  }, [esPrimeraTecla]);

  const handleKeyButton = (key) => {
    if (key == "enter") {
      onEnter();
      return;
    }

    if (key == "borrar") {
      const nuevoValor = (varValue + "").slice(0, -1);
      varChanger(nuevoValor === "" ? "0" : nuevoValor);
      return;
    }

    if (key.toLowerCase() == "limpiar") {
      varChanger("0");
      return;
    }

    const valorAnteriorValido = parseInt(varValue) > 0 ? varValue : "";
    //let nuevoValor = valorAnteriorValido + "" + key;
    let nuevoValor = parseInt(valorAnteriorValido || "0") + key;


    if (["20.000", "10.000", "5.000", "2.000", "1.000"].includes(key)) {
      nuevoValor = parseInt(valorAnteriorValido) || 0;
      if (primeraTecla) {
        nuevoValor = parseInt(key.replace(".", ""));
      } else {
        nuevoValor += parseInt(key.replace(".", ""));
      }
      setPrimeraTecla(false);
    }

    if (parseInt(nuevoValor) > maxValue) {
      showMessage("Valor muy grande");
      return;
    }

    if (onChange) {
      const changeCustom = onChange(nuevoValor);
      varChanger(changeCustom !== undefined ? changeCustom : nuevoValor);
    } else {
      varChanger(nuevoValor);
    }
  };

  if (!showFlag) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.limpiarButton}
          onPress={() => handleKeyButton("LIMPIAR")}
        >
          <Text style={styles.limpiarText}>LIMPIAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.borrarButton}
          onPress={() => handleKeyButton("borrar")}
        >
          <Text style={styles.buttonText}>Borrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.specialButton}
          onPress={() => handleKeyButton("20.000")}
        >
          <Text style={styles.buttonText}>20.000</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("1")}
        >
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("2")}
        >
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("3")}
        >
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.specialButton}
          onPress={() => handleKeyButton("10.000")}
        >
          <Text style={styles.buttonText}>10.000</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("4")}
        >
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("5")}
        >
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("6")}
        >
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.specialButton}
          onPress={() => handleKeyButton("5.000")}
        >
          <Text style={styles.buttonText}>5.000</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("7")}
        >
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("8")}
        >
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("9")}
        >
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.specialButton}
          onPress={() => handleKeyButton("2.000")}
        >
          <Text style={styles.buttonText}>2.000</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("0")}
        >
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("00")}
        >
          <Text style={styles.buttonText}>00</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => handleKeyButton("000")}
        >
          <Text style={styles.buttonText}>000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.specialButton}
          onPress={() => handleKeyButton("1.000")}
        >
          <Text style={styles.buttonText}>1.000</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    marginLeft: -185,
    width: 370,
    padding: 10,
    backgroundColor: "orange",
    zIndex: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  limpiarButton: {
    width: 150,
    height: 70,
    backgroundColor: "#f05a5a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  borrarButton: {
    width: 70,
    height: 70,
    backgroundColor: "#f0a020",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  numberButton: {
    width: 70,
    height: 70,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  specialButton: {
    width: 140,
    height: 70,
    backgroundColor: "#baf7d3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  limpiarText: {
    color: "white",
  },
});

export default TecladoPagoCaja;