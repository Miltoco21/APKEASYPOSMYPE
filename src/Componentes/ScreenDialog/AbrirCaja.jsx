// /* eslint-disable react/jsx-no-undef */
// /* eslint-disable react/prop-types */
// /* eslint-disable no-undef */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */

// import React, { useState, useContext } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   DialogTitle,
// } from "@mui/material";
// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
// import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
// import SystemHelper from "../../Helpers/System";
// import SmallButton from "../Elements/SmallButton";
// import AperturaCaja from "../../Models/AperturaCaja";
// import dayjs from "dayjs";
// import System from "../../Helpers/System";
// import Printer from "../../Models/Printer";
// import UserEvent from "../../Models/UserEvent";


// const AbrirCaja = ({openDialog, setOpenDialog}) => {
//   const { 
//     userData, 
//     updateUserData,
//     showMessage
//   } = useContext(SelectedOptionsContext);

//   const [openAmount, setOpenAmount] = useState(0)
//   const handlerSaveAction = ()=>{
//     if(openAmount == 0){
//       showMessage("Debe ingresar un monto inicial");
//       return;
//     }
    
//     var ac = new AperturaCaja();
//     ac.codigoUsuario = userData.codigoUsuario
//     ac.fechaIngreso = System.getInstance().getDateForServer()
//     ac.tipo = "INGRESO"
//     ac.detalleTipo = "INICIOCAJA"
//     ac.observacion = ""
//     ac.monto = openAmount
//     ac.idTurno = userData.idTurno

//     console.log("para enviar:");
//     console.log(ac.getFillables());
//     ac.sendToServer((res)=>{
//       var user2 = userData
//       user2.inicioCaja = true;
//       updateUserData(user2)
//       setOpenDialog(false)
//       Printer.printAll(res)

//       UserEvent.send({
//         name: "inicio de caja correctamente",
//         info: ""
//       })

//     },(error)=>{
//       showMessage(error);
//     })

//   }
  
//   return (
//     <Dialog open={openDialog} onClose={()=>{}} maxWidth="md">
//         <DialogTitle>
//           Apertura de caja
//         </DialogTitle>
//         <DialogContent>
//           <BoxAbrirCaja 
//           openAmount={openAmount} 
//           setAmount={setOpenAmount}
//           onEnter={()=>{
//             handlerSaveAction()
//           }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <SmallButton textButton="Guardar" actionButton={handlerSaveAction}/>
//         </DialogActions>
//       </Dialog>
//   );
// };

// export default AbrirCaja;
import React, { useState, useContext } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Portal, Modal, Text, Button, Surface, TextInput } from 'react-native-paper';
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// Assuming these are adapted for React Native as well
//import SystemHelper from "../../Helpers/System";
import AperturaCaja from "../../Models/AperturaCaja";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";

const BoxAbrirCaja = ({ openAmount, setAmount, onEnter }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        mode="outlined"
        label="Monto Inicial"
        keyboardType="numeric"
        value={openAmount.toString()}
        onChangeText={(text) => setAmount(Number(text))}
        onSubmitEditing={onEnter}
        style={styles.input}
      />
    </View>
  );
};

const AbrirCaja = ({ openDialog, setOpenDialog }) => {
  const { 
    userData, 
    updateUserData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [openAmount, setOpenAmount] = useState(0);

  const handlerSaveAction = () => {
    if(openAmount === 0){
      showMessage("Debe ingresar un monto inicial");
      return;
    }
    
    const ac = new AperturaCaja();
    ac.codigoUsuario = userData.codigoUsuario;
    ac.fechaIngreso = System.getInstance().getDateForServer();
    ac.tipo = "INGRESO";
    ac.detalleTipo = "INICIOCAJA";
    ac.observacion = "";
    ac.monto = openAmount;
    ac.idTurno = userData.idTurno;

    console.log("para enviar:");
    console.log(ac.getFillables());
    
    ac.sendToServer(
      (res) => {
        const user2 = userData;
        user2.inicioCaja = true;
        updateUserData(user2);
        setOpenDialog(false);
        Printer.printAll(res);

        UserEvent.send({
          name: "inicio de caja correctamente",
          info: ""
        });
      },
      (error) => {
        showMessage(error);
      }
    );
  };

  return (
    <Portal>
      <Modal
        visible={openDialog}
        onDismiss={() => {}}
        contentContainerStyle={styles.containerStyle}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Surface style={styles.surface} elevation={2}>
            <Text style={styles.title} variant="headlineSmall">
              Apertura de caja
            </Text>
            
            <BoxAbrirCaja 
              openAmount={openAmount} 
              setAmount={setOpenAmount}
              onEnter={handlerSaveAction}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handlerSaveAction}
                style={styles.button}
              >
                Guardar
              </Button>
            </View>
          </Surface>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    marginHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
});

export default AbrirCaja;