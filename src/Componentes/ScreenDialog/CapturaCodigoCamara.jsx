import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, BackHandler, TouchableOpacity } from 'react-native';
import { Portal, Modal, Text, Button, TextInput, IconButton } from 'react-native-paper';
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import AperturaCaja from "../../Models/AperturaCaja";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";

import { CameraView, Camera } from "expo-camera";


const CapturaCodigoCamara = ({
  openDialog,
  onCapture,
  setOpenDialog,
  outOnCapture = true
}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showSnackbarMessage,
    showAlert
  } = useContext(SelectedOptionsContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");

  const [border1, setBorder1] = useState(false);
  const [bgOverlay, setBgOverlay] = useState(1)


  // Unsubscribe the listener on unmount

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    // showAlert(`Bar code with type ${type} and data ${data} has been scanned!`);
    onCapture(data)
    if (outOnCapture) {
      setOpenDialog(false)
    } else {
      setBgOverlay(0.2)
      setTimeout(() => {
        setBgOverlay(1)
        setScanned(false);
      }, 3000);
    }
  };
  useEffect(() => {
    getCameraPermissions();
  }, []);

  useEffect(() => {
    if (openDialog) {
      setScanned(false)
      setScannedData("")
    }
  }, [openDialog]);


  useEffect(() => {
    if (openDialog) {
      setTimeout(() => {
        setBorder1(!border1)
      }, 1000);
    }
  }, [openDialog, border1]);

  useEffect(() => {
    console.log("scanner", scanned)
  }, [scanned])


  return (
    <Portal>
      <Modal
        visible={openDialog}
        onDismiss={() => { }}

        contentContainerStyle={{
          ...styles.containerStyle,
          opacity: bgOverlay
        }
        }
      >
        <View style={{
          ...{
            ...styles.containerCamera,
            borderWidth: 2,
            borderColor: (border1 ? "red" : "transparent"),
          }
        }
        } >
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            // barcodeScannerSettings={{
            //   barcodeTypes: ["qr", "pdf417"],
            // }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        <TouchableOpacity style={{
          width: "90%",
        }} onPress={() => {
          setOpenDialog(false)
        }}>
          <Text style={{
            ...{
              ...styles.cancelbutton,
              borderColor: (border1 ? "red" : "transparent"),
            }
          }}>Cancelar</Text>
        </TouchableOpacity>
      </Modal>
    </Portal >
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'black',
    borderRadius: 12,
    padding: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  containerCamera: {
    width: "90%",
    height: "40%",
  },
  cancelbutton: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    textTransform: "uppercase",
    paddingHorizontal: 50,
    paddingVertical: 20,
    marginTop: 30,
    backgroundColor: "lightcoral"
  }
});

export default CapturaCodigoCamara;
