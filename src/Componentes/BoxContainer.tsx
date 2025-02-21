import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BoxContainerProps {
  title: string;
  children?: React.ReactNode; // Hacemos children opcional
}

const BoxContainer: React.FC<BoxContainerProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children && <View>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default BoxContainer;
