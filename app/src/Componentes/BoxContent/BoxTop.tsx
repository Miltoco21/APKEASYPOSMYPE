// // import { useState, useEffect } from "react"
// // import { View, Text, TouchableOpacity } from "react-native"
// // import Ionicons from "@expo/vector-icons/Ionicons"
// // import CONSTANTS from "../../definitions/Constants"

// // const BoxTop = () => {
// //   const [currentTime, setCurrentTime] = useState("")
// //   const [currentDate, setCurrentDate] = useState("")

// //   const userData = {
// //     nombres: "Juan",
// //     apellidos: "Pérez",
// //   }

// //   useEffect(() => {
// //     const updateDateTime = () => {
// //       const now = new Date()
// //       setCurrentTime(now.toLocaleTimeString())
// //       setCurrentDate(now.toLocaleDateString())
// //     }

// //     const interval = setInterval(updateDateTime, 1000)
// //     updateDateTime() // Actualiza inmediatamente

// //     return () => clearInterval(interval)
// //   }, [])

// //   return (
// //     <>
// //       {/* Header Superior */}
// //       <View>
// //         <View>
// //           <Text>{CONSTANTS.appName} {"  "}v{CONSTANTS.appVersion}</Text>
// //           <View>
           
// //             {/* Avatar con iniciales */}
// //             <View>
// //               <Text>
// //                 {userData?.nombres?.charAt(0) || ""}
// //                 {userData?.apellidos?.charAt(0) || ""}
// //               </Text>
// //             </View>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Contenedor inferior */}
// //       <View>
        
// //           <View>
// //             <Text>
// //               {userData.nombres}
// //               {""} {userData.apellidos}
// //               {""}
// //               {currentTime}
// //             </Text>

// //             <TouchableOpacity
// //             //onPress={() => setOpenLogoutDialog(true)}
// //             >
// //               {/* Aquí podrías incluir un ícono de logout si lo deseas */}
// //               <Ionicons name="exit-outline" size={20} color="white" />
// //               <Text>Cerrar Sesión</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
      
// //     </>
// //   )
// // }

// // export default BoxTop

// import { useState, useEffect } from "react";
// import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
// import { Avatar, Surface, Text, TouchableRipple, useTheme, Button } from 'react-native-paper';
// import { Ionicons } from "@expo/vector-icons";

// const BoxTop = () => {
//   const [currentTime, setCurrentTime] = useState("");
//   const [currentDate, setCurrentDate] = useState("");
//   const [greeting, setGreeting] = useState("");
//   const theme = useTheme();

//   // Mock constants
//   const APP_INFO = {
//     appName: "MyApp",
//     appVersion: "1.0.0"
//   };

//   const userData = {
//     nombres: "Juan",
//     apellidos: "Pérez",
//   };

//   const updateGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Buenos días";
//     if (hour < 19) return "Buenas tardes";
//     return "Buenas noches";
//   };

//   useEffect(() => {
//     const updateDateTime = () => {
//       const now = new Date();
//       setCurrentTime(now.toLocaleTimeString('es-ES', { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       }));
//       setCurrentDate(now.toLocaleDateString('es-ES', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       }));
//       setGreeting(updateGreeting());
//     };

//     const interval = setInterval(updateDateTime, 1000);
//     updateDateTime();

//     return () => clearInterval(interval);
//   }, []);

//   const getInitials = () => {
//     return `${userData.nombres.charAt(0)}${userData.apellidos.charAt(0)}`.toUpperCase();
//   };

//   return (
//     <Surface style={styles.container} elevation={1}>
//       <View style={styles.header}>
//         <View style={styles.appInfo}>
//           <View style={styles.appInfoRow}>
//             <Text variant="labelLarge" style={styles.appName}>
//               {APP_INFO.appName}
//             </Text>
//             <Text variant="labelSmall" style={styles.versionText}>
//               v{APP_INFO.appVersion}
//             </Text>
//             <View style={styles.timeContainer}>
//               <Ionicons name="time-outline" size={14} color={theme.colors.onSurfaceVariant} />
//               <Text variant="labelSmall" style={styles.timeText}>
//                 {currentTime}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <Avatar.Text
//           size={32}
//           label={getInitials()}
//           style={styles.avatar}
//         />
//       </View>
      
//       <View>
//       <Text variant="labelSmall" style={styles.date}>
//             {currentDate}
//           </Text>

//       </View>
      
//       <View style={styles.content}>
//         <View style={styles.userInfo}>
//           <View style={styles.nameRow}>
//             <Text variant="labelMedium" style={styles.greeting}>
//               {greeting}
//             </Text>
//             <Text variant="titleSmall" style={styles.userName}>
//               {userData.nombres} {userData.apellidos}
//             </Text>
//              <TouchableOpacity
//           onPress={() => {/* Handle logout */}}
          
//         >
//           <Button
//           mode="contained-tonal"
//             compact
//             icon={({ size, color }) => (
//               <Ionicons name="exit-outline" size={14} color={color} />
//             )}
//           >
//             Cerrar Sesión
//           </Button>
//         </TouchableOpacity>
//           </View>
        
//         </View>

       
//       </View>
//     </Surface>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: Platform.OS === 'ios' ? 12 : 8,
//     paddingHorizontal: 12,
//     paddingBottom: 8,
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 7,
//   },
//   appInfo: {
//     flex: 1,
//   },
//   appInfoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   appName: {
//     fontWeight: '600',
//   },
//   versionText: {
//     opacity: 0.7,
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 'auto',
//   },
//   timeText: {
//     marginLeft: 4,
//   },
//   avatar: {
//     marginLeft: 12,
//   },
//   content: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   userInfo: {
//     gap: 2,
//     flex: 1,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 7,
//   },
//   greeting: {
//     opacity: 0.7,
//   },
//   userName: {
//     fontWeight: 'bold',
//   },
//   date: {
//     opacity: 0.7,
//   },
//   logoutButton: {
//     marginLeft: 12,
//     fontSize:8
//   },
// });

// export default BoxTop;

import { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Avatar, Surface, Text, TouchableRipple, useTheme, Button } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import CONSTANTS from "../../definitions/Constants"

const BoxTop = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const theme = useTheme();

  

  const userData = {
    nombres: "Juan",
    apellidos: "Pérez",
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  useEffect(() => {
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

    const interval = setInterval(updateDateTime, 1000);
    updateDateTime();

    return () => clearInterval(interval);
  }, []);

  const getInitials = () => {
    return `${userData.nombres.charAt(0)}${userData.apellidos.charAt(0)}`.toUpperCase();
  };

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
            <Text variant="titleSmall" style={styles.userName}>
              {userData.nombres} {userData.apellidos}
            </Text>
            <Button
              mode="text"
              compact
              style={styles.logoutButton}
              labelStyle={styles.logoutButtonLabel}
              icon={({ size, color }) => (
                <Ionicons name="exit-outline" size={12} color={color} />
              )}
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