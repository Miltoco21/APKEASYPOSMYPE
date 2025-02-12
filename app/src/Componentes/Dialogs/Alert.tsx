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

// const Alert = ({openDialog, setOpenDialog, message, title = ""}) => {
//   return (
//     <Dialog
//         open={openDialog}
//         onClose={ ()=> {
//           // setOpenDialog(false)
//         } }
//       >
//         <DialogTitle>{title}</DialogTitle>
//         <DialogContent>
//           <Typography >{message}</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={ ()=>{ setOpenDialog(false) } }>Aceptar</Button>
//         </DialogActions>
//       </Dialog>
//   );
// };

// export default Alert;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Modal, Text, Button, Surface } from 'react-native-paper';

interface AlertProps {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  message: string;
  title?: string;
}

const Alert: React.FC<AlertProps> = ({
  openDialog,
  setOpenDialog,
  message,
  title = ""
}) => {
  return (
    <Portal>
      <Modal
        visible={openDialog}
        onDismiss={() => {}}
        contentContainerStyle={styles.containerStyle}
        dismissable={false}
      >
        <Surface style={styles.surface} elevation={2}>
          {title && (
            <Text style={styles.title} variant="headlineSmall">
              {title}
            </Text>
          )}
          <Text style={styles.message} variant="bodyLarge">
            {message}
          </Text>
          <Button
            mode="contained"
            onPress={() => setOpenDialog(false)}
            style={styles.button}
          >
            Aceptar
          </Button>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    marginHorizontal: 20,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
});

export default Alert;
