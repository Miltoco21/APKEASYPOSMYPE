
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Por favor, completa todos los campos.");
//       return;
//     }
//     // Aquí puedes agregar la lógica de autenticación
//     Alert.alert("Éxito", "Inicio de sesión exitoso.");
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Iniciar Sesión</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Correo electrónico"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Contraseña"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Ingresar</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     padding: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     backgroundColor: "white",
//   },
//   button: {
//     width: "100%",
//     padding: 15,
//     backgroundColor: "#007bff",
//     alignItems: "center",
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
import React, { useState,useContext } from "react";
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
import Box from "../Componentes/Box"
import { useRouter } from "expo-router";
import BaseConfig from "../definitions/BaseConfig";
import BaseConfigModal from "../Modals/BaseConfigModal";
import SelectedOptionsProvider, { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';
import CONSTANTS from "../definitions/Constants";
import Ionicons from "@expo/vector-icons/Ionicons"

export default function Login() {

  const { userData } = useContext(SelectedOptionsContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [appConfig, setAppConfig] = useState({
    
   
  });


  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    // Aquí puedes agregar la lógica de autenticación
    Alert.alert("Éxito", "Inicio de sesión exitoso.");
    router.push("/src/Pages/Home");
  };
  const handleSaveSettings = (newUrl) => {
    // Aquí iría la lógica para guardar la URL
   
    setShowSettingsModal(false);
    // Ejemplo: guardar en AsyncStorage o Contexto
  };

  return (
    <Box style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Image style={styles.foto}
        source={require('../../../app/src/assets/images/splash.png')}
      
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>


      <TouchableOpacity
          style={styles.button}
         
          onPress={() => setShowSettingsModal(true)}
         
        >
          <Text style={styles.buttonText}>Configuraciones     <Ionicons name="settings" size={17} color="white"/></Text>
          
       
        </TouchableOpacity>
        <Text>{CONSTANTS.appName}{CONSTANTS.appVersion}</Text>
        <BaseConfigModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
       
        onSave={handleSaveSettings}
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
    marginBottom:5
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  foto:{
    width: "40%",
    height: "40%",
    resizeMode: 'contain',
  }
});
