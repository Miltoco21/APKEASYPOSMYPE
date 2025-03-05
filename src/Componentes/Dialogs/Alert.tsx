import React from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import { Portal, Text, Button, Surface } from 'react-native-paper';

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
    <Modal
      visible={openDialog}
      transparent={true}
    // animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
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

        </View>
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '50%',
  },
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
