// import React, { useState, useContext, useEffect } from "react";

// import {
//   Paper,
//   Card,
//   CardContent,
//   Table,
//   TableHead,
//   TableBody,
//   TableCell,
//   TableRow,
//   Avatar,
//   TableContainer,
//   Grid,
//   Container,
//   useTheme,
//   useMediaQuery,

//   IconButton,
//   Menu,
//   TextField,
//   Chip,
//   Box,
//   Typography,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   CircularProgress,
//   ToggleButton,
//   ToggleButtonGroup

// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// const Confirm = ({
//     openDialog,
//     setOpenDialog,
//     textConfirm,
//     handleConfirm,
//     handleNotConfirm
//   }) => {

//   return (
//     <Dialog open={openDialog} onClose={()=>{
//     }}
//     >
//       <DialogTitle style={{
//         fontSize:"28px"
//       }}>Confirmar</DialogTitle>
//       <DialogContent style={{
//         minWidth:"300px",
//         padding:20
//       }}>
//       <Typography style={{
//         textAlign:"center",
//         fontSize:"22px"
//       }}>{textConfirm}</Typography>
//       </DialogContent>
//       <DialogActions>

//       <Button onClick={()=>{
//         if(handleConfirm){
//           handleConfirm()
//         }
//         setOpenDialog(false)
//         }}
//         style={{
//           fontSize:"20px",
//           backgroundColor:"green",
//           color:"white"
//         }}
//         >Si</Button>

//         <Button onClick={()=>{
//           if(handleNotConfirm){
//             handleNotConfirm()
//           }
//           setOpenDialog(false)
//         }}
//         style={{
//           fontSize:"20px",
//           backgroundColor:"#c02e2e",
//           color:"white"
//         }}>No</Button>
//       </DialogActions>
//       </Dialog>
//   );
// };

// export default Confirm;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Dialog, Button, Text, Provider as PaperProvider } from 'react-native-paper';

interface ConfirmProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  textConfirm: string;
  handleConfirm?: () => void;
  handleNotConfirm?: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({
  openDialog,
  setOpenDialog,
  textConfirm,
  handleConfirm,
  handleNotConfirm,
}) => {
  return (
    <PaperProvider>
      <Portal>
        <Dialog
          visible={openDialog}
          onDismiss={() => setOpenDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.title}>Confirmar</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.content}>{textConfirm}</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => {
                if (handleConfirm) {
                  handleConfirm();
                }
                setOpenDialog(false);
              }}
              style={styles.confirmButton}
              labelStyle={styles.buttonLabel}
            >
              Si
            </Button>
            <View style={styles.buttonSpacer} />
            <Button
              mode="contained"
              onPress={() => {
                if (handleNotConfirm) {
                  handleNotConfirm();
                }
                setOpenDialog(false);
              }}
              style={styles.cancelButton}
              labelStyle={styles.buttonLabel}
            >
              No
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 8,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 22,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actions: {
    padding: 16,
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: 'green',
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#c02e2e',
    minWidth: 100,
  },
  buttonLabel: {
    fontSize: 20,
    color: 'white',
  },
  buttonSpacer: {
    width: 12,
  },
});

export default Confirm;