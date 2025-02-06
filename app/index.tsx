import { View, Text, StyleSheet } from 'react-native';

import { Link } from 'expo-router';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text> <Link href="/src/Pages/Login">Go to Login</Link></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
