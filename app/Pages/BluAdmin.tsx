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
import { Button } from "react-native-paper";
import Blu1 from "./Blu1";
import Blu2 from "./Blu2";
import Blu3 from "./Blu3";
import Blu4 from "./Blu4";

export default function BluAdmin({
  onSave,
  onCancel
}) {

  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)

  const falses = (callback) => {
    setShow1(false)
    setShow2(false)
    setShow3(false)
    setShow4(false)

    setTimeout(() => {
      callback()
    }, 1000);
  }

  return (
    <View>
      <Button style={styles.button} onPress={() => { falses(() => { setShow1(true) }) }}>Bluetooth 1</Button>
      <Button style={styles.button} onPress={() => { falses(() => { setShow2(true) }) }}>Bluetooth 2</Button>
      <Button style={styles.button} onPress={() => { falses(() => { setShow3(true) }) }}>Bluetooth 3</Button>
      <Button style={styles.button} onPress={() => { falses(() => { setShow4(true) }) }}>Bluetooth 4</Button>

      {show1 && (<Blu1 />)}
      {show2 && (<Blu2 />)}
      {show3 && (<Blu3 />)}
      {show4 && (<Blu4 />)}

    </View>

  );
}

const styles = StyleSheet.create({
  button:{
    height:50,
    backgroundColor:"whitesmoke",
    borderRadius:4,
    marginBottom:5,
    borderColor:"darkslategray",
    borderWidth:2
  }
});
