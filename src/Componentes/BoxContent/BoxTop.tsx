import { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { Avatar, Surface, Text, TouchableRipple, useTheme, Button } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import CONSTANTS from "../../definitions/Constants"
import User from "src/Models/User";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import { Link, router } from 'expo-router';
import Log from "src/Models/Log";
import Colors from "../Colores/Colores";

const BoxTop = () => {

  const { 
    clearSessionData,
    showLoading,
    hideLoading,
   } = useContext(SelectedOptionsContext);


  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const theme = useTheme();

  const [userData, setUserData] = useState(null);




  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const cargaInicial = async () => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
      setGreeting(updateGreeting());
    };  
    const userModel = User.getInstance()

    const guardado = await userModel.getFromSesion()
    if(guardado && !Array.isArray(guardado)){
      setUserData(guardado)
    }
    //comentado para poder debuggear 

    const interval = setInterval(updateDateTime, 1000);
    updateDateTime();

  

    return () => clearInterval(interval);
  }

  useEffect(() => {
    cargaInicial()
  }, []);

  const getInitials = () => {
    if (!userData) return "S/D"
    // Log("userData", userData)
    return `${userData.nombres.charAt(0)}${userData.apellidos.charAt(0)}`.toUpperCase();
  };

  const logout = async () => {
    const user = new User()
    user.fill(userData)
    // console.log("logout")

    const callbackLogout = async() => {
      await clearSessionData();
      router.push("./Login")
    }

    showLoading("cerrando sesion")
    
    await user.doLogoutInServer(async (response) => {
      callbackLogout()
      hideLoading()
    }, async (error) => {
      // Alert.alert(error)
      callbackLogout()
      hideLoading()
      // }
    })

  }

  return (
    <Surface style={styles.container} elevation={1}>
      <View style={styles.header}>
        <View style={styles.appInfo}>
          <View style={styles.appInfoRow}>
            <Text variant="labelLarge" style={styles.appName}>
              {CONSTANTS.appName}
            </Text>
            <Text variant="labelSmall" style={styles.versionText}>
              v{CONSTANTS.appVersion}
            </Text>

          </View>
        </View>

        <Avatar.Text
          size={32}
          label={getInitials()}
          style={styles.avatar}
        />
      </View>

      <Text variant="labelSmall" style={styles.date}>
        {currentDate}{
          " "
        }
        {currentTime}

      </Text>

      <View style={styles.content}>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text variant="labelMedium" style={styles.greeting}>
              {greeting}
            </Text>

            {userData && (
              <Text variant="titleSmall" style={styles.userName}>
                {userData.nombres} {userData.apellidos}
              </Text>
            )}
            <Button
              mode="text"
              compact
              style={styles.logoutButton}
              labelStyle={styles.logoutButtonLabel}
              icon={({ size, color }) => (
                <Ionicons name="exit-outline" size={12} color={color} />
              )}

              onPress={logout}
            >
              Cerrar
            </Button>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appInfo: {
    flex: 1,
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    fontWeight: '500',
  },
  versionText: {
    opacity: 0.7,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  timeText: {
    marginLeft: 4,
  },
  avatar: {
    marginLeft: 12,
    backgroundColor:Colors.azul
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    opacity: 0.7,
  },
  userName: {
    fontWeight: '200',
  },
  date: {
    opacity: 0.7,
    marginBottom: 1,
  },
  logoutButton: {
    marginLeft: -13,
    minWidth: 0,
    paddingHorizontal: 8,
  },
  logoutButtonLabel: {
    fontSize: 12,
    marginLeft: 2,
  },
});

export default BoxTop;