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
import ProductsItem from "../ScreenContent/ProductItem";
import ShowProductItem from "../ScreenContent/ShowProductItem";

const GrillaProductosVendidos = ({
  productsSold,
  subtotal,
  redondeo,
  vuelto,
  total,
}) => {

  const {
    clearSessionData,
    showLoading,
    hideLoading,
  } = useContext(SelectedOptionsContext);




  useEffect(() => {
  }, []);

  return (
    <Surface style={styles.container} elevation={1}>
      <View style={{}}>
        <View style={{}}>

          <View style={{}}>
            {productsSold.map((pro, ix) => (
              <ShowProductItem
                item={pro}
                index={ix}
                onRefresh={() => {
                }}
                key={ix}
              />))}
          </View>

        </View>
        <View style={{}}>
          <Text>Subtotal:${subtotal}</Text>
          <Text>Redondeo:${redondeo}</Text>
          <Text>Vuelto:${vuelto}</Text>
          <Text>Total:${total}</Text>

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
    // borderBottomLeftRadius: 16,
    // borderBottomRightRadius: 16,
    width:"100%"
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
    backgroundColor: Colors.azul
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

export default GrillaProductosVendidos;