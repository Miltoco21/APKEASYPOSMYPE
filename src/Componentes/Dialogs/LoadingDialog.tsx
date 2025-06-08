import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { Portal, Text, ActivityIndicator, Surface } from 'react-native-paper';

interface LoadingDialogProps {
  openDialog: boolean;
  text?: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({
  openDialog,
  text = 'Loading...'
}) => {
  return (
    <Modal
      visible={openDialog}
      transparent={true}
    // animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" style={styles.spinner} />
          <Text style={styles.text} variant="bodyLarge">
            {text}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderWidth: 1,
    borderColor: "red solid",
    backgroundColor: 'white',
    boxShadow: "2px 2px 8px 1px black",
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
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
    // color: "red"
  },
});

export default LoadingDialog;