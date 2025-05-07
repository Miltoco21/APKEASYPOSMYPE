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
  PermissionsAndroid,
  Alert
} from "react-native";

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function Blu({
}) {

  const pedir = async (que, callbackOk, callbakcWrong) => {

    try {
      var granted = await PermissionsAndroid.request(
        que,
        {
          title: 'Permiso ' + que,
          message:
            'Se requiere permiso: ' + que,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        callbackOk()
      } else {
        callbakcWrong(que + ' denied');
      }

    } catch (err) {
      callbakcWrong(err);
    }
  }

  const ss = async () => {
    const checkResult = await check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    if (checkResult !== RESULTS.GRANTED) {
      const requestResult = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
      if (requestResult === RESULTS.GRANTED) {
        Alert.alert('Camera permission granted');
      } else {
        Alert.alert('Camera permission denied');
      }
    }
  }


  useEffect(() => {
    ss()
  }, [])

  return (
    <View>
      <Text>Impresion bluetooth3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
});
