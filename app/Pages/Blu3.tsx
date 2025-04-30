import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  DeviceEventEmitter,
  ScrollView,
} from "react-native";

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

export default function Blu({
}) {

  return (
    <View>
      <Text>Impresion bluetooth3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
});
