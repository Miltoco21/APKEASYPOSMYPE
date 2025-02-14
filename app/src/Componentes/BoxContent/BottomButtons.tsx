import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';

const BottomButtons = () => {
  const { clearSalesData } = React.useContext(SelectedOptionsContext);
  const [index, setIndex] = React.useState(0);
  const { colors } = useTheme();

  const routes = [
    { 
      key: 'clear', 
      title: 'Limpiar', 
      icon: 'broom',
      onPress: () => {
        clearSalesData();
        setIndex(0);
      }
    },
    { 
      key: 'familias', 
      title: 'Familias', 
      icon: 'shape-outline',
      onPress: () => {
        // Lógica para familias
        setIndex(1);
      }
    },
    { 
      key: 'search', 
      title: 'Búsqueda', 
      icon: 'magnify',
      onPress: () => {
        // Lógica de búsqueda rápida
        setIndex(2);
      }
    },
    { 
      key: 'config', 
      title: 'Config', 
      icon: 'cog',
      onPress: () => {
        // Lógica de configuración
        setIndex(3);
      }
    },
    { 
      key: 'more', 
      title: 'Más', 
      icon: 'dots-horizontal',
      onPress: () => {
        // Menú adicional
        setIndex(4);
      }
    }
  ];

  const renderScene = ({ route }) => {
    // Puedes agregar lógica de renderizado específica para cada ruta si es necesario
    return null;
  };

  return (
    <View style={styles.container}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={false}
        labeled={true}
        activeColor={colors.primary}
        inactiveColor={colors.secondary}
        barStyle={[styles.navBar, { backgroundColor: colors.surface }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  navBar: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default BottomButtons;