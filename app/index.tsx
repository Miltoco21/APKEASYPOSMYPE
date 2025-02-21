import { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { Link, router } from 'expo-router';
import Box from './src/Componentes/Box';


export default function HomeScreen() {
  const imageScale = new Animated.Value(0.1);

  useEffect(() => {
    // Animación
    Animated.timing(imageScale, {
      toValue: 0.95,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // const timer = setTimeout(() => {
    //   //  router.push("/src/Pages/Login");
    //    router.push("/src/Pages/Home");
    // }, 3000);

    // return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <View style={styles.container}>
        <Animated.Image
          source={require('../app/src/assets/images/splash.png')}
          style={[styles.image, { transform: [{ scale: imageScale }] }]}
        />
        
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
});