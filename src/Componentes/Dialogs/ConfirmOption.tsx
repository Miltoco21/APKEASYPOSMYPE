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
// import SmallButton from "../Elements/SmallButton";

// const ConfirmOption = ({
//     openDialog,
//     setOpenDialog,

//     textTitle = "Confirmar",
//     textConfirm,
//     onClick,
//     buttonOptions
//   }) => {

//   return (
//     <Dialog open={openDialog} onClose={()=>{
//       setOpenDialog(false)
//     }}
//     >
//       <DialogTitle style={{
//         fontSize:"28px",
//         textAlign:"center"
//       }}>{textTitle}</DialogTitle>
//       <DialogContent style={{
//         minWidth:"300px",
//         padding:20
//       }}>
//       <Typography style={{
//         textAlign:"center",
//         fontSize:"22px"
//       }}>{textConfirm}</Typography>
//       </DialogContent>
//       <DialogActions style={{ justifyContent: "center" }}>
//         {buttonOptions.map((option,ix)=>{
//           return (
//             <SmallButton key={ix} actionButton={()=>{
//               onClick(ix)
//               setOpenDialog(false)
//             }}
//             style={{
//               fontSize:"20px",
//               // backgroundColor:"green",
//               // color:"white"
//             }}

//             textButton={option}
//             />
//           )
//         })}

//       </DialogActions>
//       </Dialog>
//   );
// };

// export default ConfirmOption;
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, Button, Text, Surface } from 'react-native-paper';

interface ConfirmOptionProps {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  textTitle?: string;
  textConfirm: string;
  onClick: (index: number) => void;
  buttonOptions: string[];
}

const ConfirmOption: React.FC<ConfirmOptionProps> = ({
  openDialog,
  setOpenDialog,
  textTitle = "Confirmar",
  textConfirm,
  onClick,
  buttonOptions
}) => {
  return (
    <Modal
      visible={openDialog}
      onDismiss={() => setOpenDialog(false)}
      contentContainerStyle={styles.containerStyle}
    >
      <Surface style={styles.surface} elevation={2}>
        <Text style={styles.title} variant="headlineMedium">
          {textTitle}
        </Text>

        <Text style={styles.confirmText} variant="titleMedium">
          {textConfirm}
        </Text>

        <View style={styles.buttonContainer}>
          {buttonOptions.map((option, ix) => (
            <Button
              key={ix}
              mode="contained"
              onPress={() => {
                onClick(ix);
                setOpenDialog(false);
              }}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              {option}
            </Button>
          ))}
        </View>
      </Surface>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    marginHorizontal: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  confirmText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 5,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ConfirmOption;