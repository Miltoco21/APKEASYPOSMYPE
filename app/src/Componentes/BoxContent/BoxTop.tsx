import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import CONSTANTS from "../../definitions/Constants"

const BoxTop = () => {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  const userData = {
    nombres: "Juan",
    apellidos: "Pérez",
  }

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
      setCurrentDate(now.toLocaleDateString())
    }

    const interval = setInterval(updateDateTime, 1000)
    updateDateTime() // Actualiza inmediatamente

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Header Superior */}
      <View>
        <View>
          <Text>{CONSTANTS.appName} {"  "}v{CONSTANTS.appVersion}</Text>
          <View>
           
            {/* Avatar con iniciales */}
            <View>
              <Text>
                {userData?.nombres?.charAt(0) || ""}
                {userData?.apellidos?.charAt(0) || ""}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contenedor inferior */}
      <View>
        
          <View>
            <Text>
              {userData.nombres}
              {""} {userData.apellidos}
              {""}
              {currentTime}
            </Text>

            <TouchableOpacity
            //onPress={() => setOpenLogoutDialog(true)}
            >
              {/* Aquí podrías incluir un ícono de logout si lo deseas */}
              <Ionicons name="exit-outline" size={20} color="white" />
              <Text>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      
    </>
  )
}

export default BoxTop

