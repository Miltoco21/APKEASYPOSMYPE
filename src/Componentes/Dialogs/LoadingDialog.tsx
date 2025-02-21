// import React from "react";

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// const LoadingDialog = ({openDialog, text}) => {
//     /**
//   How to use:
  
//   import LoadingDialog from "../Components/Dialogs/LoadingDialog";

//   ...

//   <LoadingDialog openDialog = {openLoadingDialog} text={loadingDialogText} />

//   ...
  
//   <Button
//     onClick={()=>{ 
//       setOpenLoadingDialog(true)
//       setTimeout(() => {
//         setOpenLoadingDialog(false)
//       }, 2000);
//     }}
//   >
//     Test loading dialog
//   </Button>
      
//   */
//   return (
//     <Dialog
//       open={openDialog}
//       onClose={ () => {} }
//     >
//       <DialogContent style={{
//         textAlign: "center"
//       }}>
//         <CircularProgress/>
//         <Typography>{text}</Typography>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default LoadingDialog;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, Text, ActivityIndicator, Surface } from 'react-native-paper';

interface LoadingDialogProps {
  visible: boolean;
  text?: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({
  visible,
  text = 'Loading...'
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {}}
        contentContainerStyle={styles.containerStyle}
        dismissable={false}
      >
        <Surface style={styles.surface} elevation={2}>
          <ActivityIndicator size="large" style={styles.spinner} />
          <Text style={styles.text} variant="bodyLarge">
            {text}
          </Text>
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
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
  },
});

export default LoadingDialog;