
// import React, { useContext, useState } from 'react';
// import { BottomNavigation, useTheme } from 'react-native-paper';
// import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
// import Ionicons from "@expo/vector-icons/Ionicons";

// const BottomButtons = () => {
//   const { clearSalesData } = useContext(SelectedOptionsContext);
//   const [index, setIndex] = useState(0);
//   const { colors } = useTheme();

//   const routes = [
//     { key: 'clear', title: 'Limpiar', icon: 'trash' as const },
//     { key: 'familias', title: 'Familias', icon: 'shapes' as const },
//     { key: 'search', title: 'Búsqueda', icon: 'search' as const },
//     { key: 'config', title: 'Ajustes', icon: 'settings' as const }
//   ];

//   const renderScene = BottomNavigation.SceneMap({
//     clear: () => null,
//     familias: () => null,
//     search: () => null,
//     config: () => null,
//   });


// // ejemplo para abrir comnetes desde las rutas
// // const renderScene = BottomNavigation.SceneMap({
// //     clear: () => <ClearScreen />,
// //     familias: () => <FamiliasScreen />,
// //     search: () => <SearchScreen />,
// //     config: () => <ConfigScreen />,
// // });

//   return (
//     <BottomNavigation
//       navigationState={{ index, routes }}
//       onIndexChange={setIndex}
//       renderScene={renderScene}
//       renderIcon={({ route, color, focused }) => (
//         <Ionicons
//           name={route.icon}
//           size={24}
//           color={focused ? "#283048" : color}
//         />
//       )}
//       shifting={false}
//       barStyle={{ backgroundColor: colors.background }}
//       onTabPress={({ route }) => {
//         if (route.key === 'clear') {
//           clearSalesData();
//           setIndex(0);
//         }
//       }}
//     />
//   );
// };

//export default BottomButtons;

import React, { useContext, useState } from 'react';
import { BottomNavigation, useTheme, } from 'react-native-paper';
import { Platform, StyleSheet } from 'react-native';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Ionicons from "@expo/vector-icons/Ionicons";

const BottomButtons = () => {
  const { clearSalesData } = useContext(SelectedOptionsContext);
  const [index, setIndex] = useState(0);
  const { colors } = useTheme();

  const routes = [
    { key: 'clear', title: 'Limpiar', icon: 'trash'as const },
    { key: 'familias', title: 'Familias', icon: 'shapes' as const },
    { key: 'search', title: 'Productos ', icon: 'search' as const},
    { key: 'config', title: 'Ajustes', icon: 'settings'as const },
    // { key: 'ventas', title: 'Ventas', icon: 'cart'as const },
    // { key: 'reportes', title: 'Reportes', icon: 'stats-chart'as const },
    // { key: 'usuarios', title: 'Usuarios', icon: 'people'as const },
    // { key: 'mas', title: 'Más', icon: 'ellipsis-horizontal'as const },
  ];

  const renderScene = BottomNavigation.SceneMap({
    clear: () => null,
    familias: () => null,
    search: () => null,
    config: () => null,
    // ventas: () => null,
    // reportes: () => null,
    // usuarios: () => null,
    // mas: () => null,
  });

  
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={({ route, color, focused }) => {
        return (
          <Ionicons
            name={route.icon}
            size={24}
            color={focused ? "#283048" : color}
          />
        );
      }}
      shifting={false} // Asegura que los íconos siempre sean visibles
      barStyle={{ backgroundColor: colors.background }}
      onTabPress={({ route }) => {
        if (route.key === 'clear') {
          clearSalesData();
          setIndex(0);
        }
      }}
    />
  );
};

export default BottomButtons;
const styles = StyleSheet.create({
  bar: {
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  icon: {
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    includeFontPadding: false,
    textAlign: 'center',
  }
});