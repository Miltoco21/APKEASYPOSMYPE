import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from "react-native";
import Box from "../../src/Componentes/Box"
import { useRouter } from "expo-router";
import BaseConfig from "../../src/definitions/BaseConfig";
import BaseConfigModal from "../../src/Modals/BaseConfigModal";
import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';
import CONSTANTS from "../../src/definitions/Constants";
import Ionicons from "@expo/vector-icons/Ionicons"
import User from "src/Models/User";
import Log from "src/Models/Log";
import ModelConfig from "src/Models/ModelConfig";

export default function Login() {

  const {
    userData,
    updateUserData,
    showLoading,
    hideLoading,
    GeneralElements,
    showAlert
  } = useContext(SelectedOptionsContext);

  const [rutOrCode, setRutOrCode] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [reintentarPorSesionActiva, setReintentarPorSesionActiva] = useState(false);

  const handleLogin = async () => {
    // console.log("haciendo login..")
    if (!rutOrCode || !password) {
      showAlert("Login incompleto", "Por favor, completa todos los campos.")
      return;
    }
    // Aquí puedes agregar la lógica de autenticación

    var user = new User();
    user.setRutFrom(rutOrCode)
    user.setUserCodeFrom(rutOrCode)
    user.setPassword(password)

    showLoading("Ingresando al sistema...")
    await user.doLoginInServer((info) => {
      updateUserData(info.responseUsuario);

      console.log("devuelve el login de la api", info.responseUsuario)



      hideLoading()
      router.navigate("./Home");
    }, async (error) => {

      // console.log("error", error)
      // hideLoading()
      // Alert.alert(error)

      console.log("error", error)
      if (
        error === "El Usuario tiene una Sesión activa."
        && !reintentarPorSesionActiva
      ) {
        setReintentarPorSesionActiva(true)
      } else {
        Alert.alert(error)
        // hideLoading()
      }

    })
  };


  const intentarLogout = async () => {
    // console.log("intentarLogout")
    var user = new User();
    user.setRutFrom(rutOrCode)
    user.setUserCodeFrom(rutOrCode)
    user.setPassword(password)

    if (user.codigoUsuario === 0) {
      // console.log("buscando usuario por rut", rutOrCode)
      await User.getByRut(rutOrCode, async (usuarios) => {
        const usuario = usuarios[0]

        const user2 = new User()
        user2.codigoUsuario = usuario.codigoUsuario

        await user2.doLogoutInServer(async (response) => {
          // console.log("listo 2 el logout..intentamos hacer login")
          handleLogin()
        }, async (error) => {

          // console.log("no se pudo 2 hacer logout..", error)
          // Alert.alert(error)

          // }
        })

      }, (error) => {

      })
    } else {
      await user.doLogoutInServer(async (response) => {
        // console.log("listo el logout..intentamos hacer login")
        handleLogin()
      }, async (error) => {

        // console.log("no se pudo hacer logout..", error)
        // Alert.alert(error)

        // }
      })


    }


  }


  const cargaInicial = async () => {
    // console.log("carga inicial")
    const us = User.getInstance()

    // await us.sesion.eliminar({id:1})

    const ses = await us.getFromSesion()

    console.log("ses", ses)

    const cargado = await User.getInstance().getFromSesion()
    if (cargado) {
      router.navigate("./Home");
    }

    // Log("cargado",cargado)
  }

  useEffect(() => {
    if (reintentarPorSesionActiva) {
      intentarLogout()
    }
  }, [reintentarPorSesionActiva])

  useEffect(() => {
    cargaInicial()
  }, [])



  return (
    <Box style={styles.container}>
      <GeneralElements />

      <Text style={styles.title}>Iniciar Sesión</Text>
      <Image style={styles.foto}
        source={require('../../src/assets/images/splash.png')}

      />
      <TextInput
        style={styles.input}
        placeholder="Rut o Codigo de usuario"
        value={rutOrCode}
        onChangeText={setRutOrCode}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        keyboardType="numeric"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}

        onPress={() => setShowSettingsModal(true)}

      >
        <Text style={styles.buttonText}>Configuraciones     <Ionicons name="settings" size={17} color="white" /></Text>


      </TouchableOpacity>

      <Text>{CONSTANTS.appName}{CONSTANTS.appVersion}</Text>
      <BaseConfigModal
        openDialog={showSettingsModal}
        setOpenDialog={setShowSettingsModal}
        onChange={async () => {
          // console.log("cambio algo de la config")
        }}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 5
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  foto: {
    width: "40%",
    height: "40%",
    resizeMode: 'contain',
  }
});
