import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Image,
  Alert
} from "react-native";
import Box from "../../src/Componentes/Box"
import { useRouter } from "expo-router";
import BaseConfig from "../../src/definitions/BaseConfig";
import BaseConfigModal from "../../src/Modals/ConfigModal";
import { SelectedOptionsContext } from '../../src/Componentes/Context/SelectedOptionsProvider';
import { ProviderModalesContext } from '../../src/Componentes/Context/ProviderModales';
import CONSTANTS from "../../src/definitions/Constants";
import Ionicons from "@expo/vector-icons/Ionicons"
import User from "src/Models/User";
import Log from "src/Models/Log";
import ModelConfig from "src/Models/ModelConfig";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Sucursal from "src/Models/Sucursal";


export default function Login() {

  const {
    GeneralElements2,
  } = useContext(ProviderModalesContext);

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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



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

    const callbackwrong = async (error) => {
      // console.log("error", error)
      hideLoading()
      // showAlert(error)

      console.log("error", error)
      if (
        error === "El Usuario tiene una Sesión activa."
        || (error + "").toLocaleLowerCase().indexOf("la caja tiene un turno iniciado") > -1
        || (error + "").toLocaleLowerCase().indexOf("EL Usuario(Cajero)") > -1
        && !reintentarPorSesionActiva
      ) {
        setReintentarPorSesionActiva(true)
      } else {
        showAlert(error)
        // hideLoading()
      }
    }

    showLoading("Ingresando al sistema...")
    await user.checkLicenciaLogin(async (respLic) => {
      // Log("respLic", respLic)

      await ModelConfig.change("urlBase", respLic.data.license.url)
      await ModelConfig.change("idEmpresa", respLic.data.license.idEmpresa)
      // console.log("buscando sucursal")
      await Sucursal.getAll((sucs) => {
        // Log("sucs", sucs)
        sucs.forEach(async (s) => {
          if (s.descripcionSucursal == "mype " + respLic.data.license.user_rut) {
            // Log("se encontro la sucursal", s)

            // Log("datos a usar", {
            //   "sucursal": s.idSucursal,
            //   "sucursalNombre": s.descripcionSucursal,
            //   "puntoVenta": s.puntoVenta[0].idCaja,
            //   "puntoVentaNombre": s.puntoVenta[0].sPuntoVenta
            // })
            await ModelConfig.change("sucursal", s.idSucursal + "")
            await ModelConfig.change("sucursalNombre", s.descripcionSucursal)

            const pv = s.puntoVenta[0].idCaja + ""
            // console.log("punto de venta antes de guardar ", pv)
            await ModelConfig.change("puntoVenta", pv)

            // console.log("punto de venta quedo ", await ModelConfig.get("puntoVenta"))

            await ModelConfig.change("puntoVentaNombre", s.puntoVenta[0].sPuntoVenta)

            await user.doLoginInServer((info) => {
              info.responseUsuario.pass = user.clave
              updateUserData(info.responseUsuario);
              hideLoading()
              router.navigate("./Home");
            }, callbackwrong)
          }
        })
      }, (er) => {
        console.log("sucursales er", er)
        showAlert("No se pudo cargar bien la sucursal y caja.")
      })
    }, callbackwrong)
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

        showLoading("Cerrando sesion anterior...")
        await user2.doLogoutInServer(async (response) => {
          // console.log("listo 2 el logout..intentamos hacer login")
          hideLoading()
          handleLogin()
          setReintentarPorSesionActiva(false)
        }, async (error) => {
          hideLoading()
          showAlert("No se pudo cerrar sesion anterior", error)
          setReintentarPorSesionActiva(false)
          // console.log("no se pudo 2 hacer logout..", error)
          // showAlert(error)

          // }
        })

      }, (error) => {

      })
    } else {
      showLoading("Cerrando sesion anterior...")

      await user.doLogoutInServer(async (response) => {
        // console.log("listo el logout..intentamos hacer login")
        hideLoading()
        setReintentarPorSesionActiva(false)
        handleLogin()
      }, async (error) => {
        hideLoading()
        // console.log("no se pudo hacer logout..", error)
        setReintentarPorSesionActiva(false)
        // showAlert(error)

        // }
      })


    }


  }


  const pedirPermiso = async (cual, callbackok, callbackwrong) => {

    try {

      const checkResult = await check(cual);
      // console.log("checkResult", checkResult)
      // if (checkResult === RESULTS.UNAVAILABLE) {
      //   console.log("version vieja")
      //   console.log("pidiendo permiso ", cual)
      //   var granted = await PermissionsAndroid.request(
      //     cual,
      //     {
      //       title: 'Permiso ' + cual,
      //       message:
      //         'Se requiere permiso: ' + cual,
      //       buttonNeutral: 'Ask Me Later',
      //       buttonNegative: 'Cancel',
      //       buttonPositive: 'OK',
      //     },
      //   );
      //   console.log("resultado de la solicitud", granted)
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     callbackok()
      //   } else {
      //     callbackwrong(cual + ' denied');
      //   }
      //   return
      // }

      if (checkResult !== RESULTS.GRANTED) {
        const requestResult = await request(cual);
        if (requestResult === RESULTS.GRANTED) {
          // Alert.alert('Camera permission granted');
          callbackok()
        } else {
          callbackwrong()
        }
      }
    } catch (err) {
      Alert.alert(err)
    }
  }


  const permisosBluetooth = async (quePermiso) => {
    await pedirPermiso(quePermiso, () => { }, async () => {
      // Alert.alert('Se necesita el permiso del bluetooh');
      if (await ModelConfig.get("usarImpresoraBluetooth")) {
        setTimeout(async () => {
          await permisosBluetooth(quePermiso)
        }, 10000);
      }
    })
  }

  const cargaInicial = async () => {
    if (await ModelConfig.get("usarImpresoraBluetooth")) {
      permisosBluetooth(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT)
      permisosBluetooth(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
      permisosBluetooth(PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE)
    }

    const userModel = new User();

    const logueado = await userModel.getFromSesion()
    if (logueado && !Array.isArray(logueado)) {
      var user = new User();
      user.setRutFrom(logueado.rut)
      user.setPassword(logueado.pass)
      await user.checkLicenciaLogin(async (respLic) => {
        Log("respLic", respLic)
        await ModelConfig.change("urlBase", respLic.data.license.url)
        router.navigate("./Home");
      }, (ero) => {
        showAlert("Licencia", "La licencia no es correcta", true)
        userModel.sesion.truncate();
      })

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
      <GeneralElements2 />

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
      {/* <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        keyboardType="numeric"
        secureTextEntry
      /> */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          keyboardType="numeric"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

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
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
});
