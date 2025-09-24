// // /* eslint-disable react/jsx-no-undef */
// // /* eslint-disable react/prop-types */
// // /* eslint-disable no-undef */
// // /* eslint-disable react-hooks/exhaustive-deps */
// // /* eslint-disable no-unused-vars */
// import React, { useState, useContext } from "react";
// import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
// import { Portal, Modal, Text, Button, Surface, TextInput } from 'react-native-paper';
// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
// import AperturaCaja from "../../Models/AperturaCaja";
// import System from "../../Helpers/System";
// import Printer from "../../Models/Printer";
// import UserEvent from "../../Models/UserEvent";
// import Typography from "../Typography";

// const AbrirCaja = ({ openDialog, setOpenDialog }) => {
//   const { 
//     userData, 
//     updateUserData,
//     showMessage
//   } = useContext(SelectedOptionsContext);

//   const [openAmount, setOpenAmount] = useState(0);

//   const handlerSaveAction = () => {
//     if(openAmount === 0){
//       showMessage("Debe ingresar un monto inicial");
//       return;
//     }

//     const ac = new AperturaCaja();
//     ac.codigoUsuario = userData.codigoUsuario;
//     ac.fechaIngreso = System.getInstance().getDateForServer();
//     ac.tipo = "INGRESO";
//     ac.detalleTipo = "INICIOCAJA";
//     ac.observacion = "";
//     ac.monto = openAmount;
//     ac.idTurno = userData.idTurno;

//     console.log("para enviar:");
//     console.log(ac.getFillables());

//     ac.sendToServer(
//       (res) => {
//         const user2 = userData;
//         user2.inicioCaja = true;
//         updateUserData(user2);
//         setOpenDialog(false);
//         Printer.printAll(res);

//         UserEvent.send({
//           name: "inicio de caja correctamente",
//           info: ""
//         });
//       },
//       (error) => {
//         showMessage(error);
//       }
//     );
//   };

//   return (
//     <Portal>
//       <Modal
//         visible={openDialog}
//         onDismiss={() => setOpenDialog(false)}
//         contentContainerStyle={styles.containerStyle}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.keyboardView}
//         >
//           <Surface style={styles.surface} elevation={2}>
//             <Text style={styles.title} variant="headlineSmall">
//               Apertura de caja
//             </Text>
//             <TextInput
//               mode="outlined"
//               label="Monto Inicial"
//               keyboardType="numeric"
//               value={openAmount.toString()}
//               onChangeText={(text) => setOpenAmount(Number(text))}
//               style={styles.input}
//             />
//             <View style={styles.buttonContainer}>
//               <Button
//                 mode="contained"
//                 onPress={handlerSaveAction}
//                 style={styles.button}
//               >
//                 Guardar
//               </Button>
//             </View>
//           </Surface>
//         </KeyboardAvoidingView>
//       </Modal>
//     </Portal>
//   );
// };

// const styles = StyleSheet.create({
//   containerStyle: {

//     padding: 20,
//     marginHorizontal: 20,
//   },
//   keyboardView: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   surface: {
//     padding: 24,
//     borderRadius: 12,
//     backgroundColor: 'white',
//   },
//   title: {
//     textAlign: 'center',
//     marginBottom: 24,
//     fontWeight: 'bold',
//   },
//   input: {
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 16,
//   },
//   button: {
//     minWidth: 100,
//   },
// });

// export default AbrirCaja;
import React, { useState, useContext, useRef, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Portal, Modal, Text, Button, TextInput } from 'react-native-paper';
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import AperturaCaja from "../../Models/AperturaCaja";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import Colors from "../Colores/Colores";
import PrinterBluetooth from "src/Models/PrinterBluetooth";

const AbrirCaja = ({ openDialog, setOpenDialog }) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showSnackbarMessage,

  } = useContext(SelectedOptionsContext);

  const [openAmount, setOpenAmount] = useState(0);

  const inputRef = useRef(null)

  const handlerSaveAction = () => {
    if (openAmount === 0) {
      showSnackbarMessage("Debe ingresar un monto inicial");
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

        console.log("realizado ok. cierre..")
        const user2 = userData;
        user2.inicioCaja = true;
        updateUserData(user2);
        // Printer.printAll(res);
        ac.operacion = "inicioCaja"
        PrinterBluetooth.prepareBluetooth(() => {
          PrinterBluetooth.printAll(ac, res);
        })

        UserEvent.send({
          name: "inicio de caja correctamente",
          info: ""
        });
        setOpenDialog(false);
        console.log("llego al final de inicio caja modal")
      },
      (error) => {
        console.log("error al final de inicio caja modal")
        Log("error", error)
        showMessage(error);
      }
    );
  };


  useEffect(() => {
    // console.log("inicia abrir caja..openDialog", openDialog)
    // console.log("inicia abrir caja..inputRef", inputRef)
    if (openDialog) {
      // console.log("inicia abrir caja")
      setTimeout(() => {
        // console.log("abrir caja intenta foco")
        System.intentarFoco(inputRef)
      }, 300);
    }

  }, [openDialog])

  return (
    <Portal>
      <Modal
        visible={openDialog}
        onDismiss={() => { }}

        contentContainerStyle={styles.containerStyle}
      >

        <View style={styles.modalContent}>
          <Text style={styles.title} variant="headlineSmall">
            Apertura de caja
          </Text>
          <Text style={styles.title2} >
            Ingrese el monto inicial para abrir la caja
          </Text>


          <TextInput
            ref={inputRef}
            mode="outlined"
            label="Monto Inicial"
            keyboardType="numeric"
            value={openAmount.toString()}
            onChangeText={(text) => setOpenAmount(Number(text))}
            style={styles.input}
            returnKeyType="default"

            onSubmitEditing={(e) => {
              console.log("apreto enter")
              handlerSaveAction()
            }}
          />
          <Button
            mode="contained"
            onPress={handlerSaveAction}
            style={styles.button}
          >
            Guardar
          </Button>
        </View>

      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,

  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.azul,
  },
});

export default AbrirCaja;
