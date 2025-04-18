import { useContext, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import Box from '../src/Componentes/Box';
import StorageSesion from 'src/Helpers/StorageSesion';
import dayjs from 'dayjs';
import Log from 'src/Models/Log';

import { SelectedOptionsContext } from '../src/Componentes/Context/SelectedOptionsProvider';

export default function HomeScreen() {

  const {
    userData,
    updateUserData,
    showLoading,
    hideLoading,
    GeneralElements,
    showAlert,
    showConfirm
  } = useContext(SelectedOptionsContext);


  const imageScale = new Animated.Value(1);

  const [tocoPantalla, setTocoPantalla] = useState(0)
  const [hacerRedirect, setHacerRedirect] = useState(false)

  useEffect(() => {
    // Animación
    Animated.timing(imageScale, {
      toValue: 0.6,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // setTimeout(() => {
      //   setHacerRedirect(true)
      // }, 2000);
    });


    const timer = setTimeout(() => {
      setHacerRedirect(true)

      Animated.timing(imageScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
      //  router.push("./Pages/Home");
    }, 2000);

    // console.log("arranca todo")
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (hacerRedirect) {
      if (tocoPantalla < 3) {
        router.navigate("./Pages/Login");
        //  router.push("./Pages/Home");
      }
    }
  }, [hacerRedirect]);

  return (
    <Box>
      <View style={styles.container} onTouchEnd={() => {
        setTocoPantalla((prev) => {
          return prev + 1
        })

        return false
      }}>
        <Animated.Image
          source={require('./../src/assets/images/splash.png')}
          style={[styles.image, { transform: [{ scale: imageScale }] }]}
        />

        <TouchableOpacity style={[{
          display: (tocoPantalla < 3 ? "none" : "flex")
        }, styles.botonRojo]} onPress={() => {
          showConfirm("Limpiar cache?", async () => {
            const ls = new StorageSesion("x")
            const userS = new StorageSesion("User")
            const configS = new StorageSesion("config")

            await userS.truncate()
            await configS.truncate()

            const quedanUsers = (await userS.cargarGuardados()).length > 0
            const quedanConfigs = (await configS.cargarGuardados()).length > 0

            console.log("quedanUsers", quedanUsers)
            console.log("quedanConfigs", quedanConfigs)

            showAlert(!quedanUsers && !quedanConfigs ? "Limpiado correctamente" : "No se pudo limpiar")
          }, () => {
          })
        }}>
          <Text style={{
            fontSize: 20,
            color: "white"
          }}>
            Limpiar cache
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[{
          display: (tocoPantalla < 3 ? "none" : "flex")
        }, styles.botonAzul]} onPress={() => {
          router.navigate("./Pages/Login");
        }}>
          <Text style={{
            fontSize: 20,
            color: "white"
          }}>
            Continuar
          </Text>
        </TouchableOpacity>
        {/* Link manual funcionando */}
        {/* <Text style={styles.link}>
          <Link href="/src/Pages/Login">Ir al Login manualmente</Link>
        </Text> */}
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: 'contain',
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },

  botonRojo: {
    marginTop: 10,
    backgroundColor: "#FF0000",
    minHeight: 50,
    width: "100%",
    padding: 20,
    alignItems: "center"
  },

  botonAzul: {
    marginTop: 10,
    backgroundColor: "#03014E",
    minHeight: 50,
    width: "100%",
    padding: 20,
    alignItems: "center"
  }
});