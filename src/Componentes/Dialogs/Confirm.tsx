import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const Confirm = ({
  openDialog,
  setOpenDialog,
  textConfirm,
  handleConfirm,
  handleNotConfirm
}) => {

  return (
    <Modal
      visible={openDialog}
      transparent={true}
      animationType="slide"

      onDismiss={() => {
        setOpenDialog(false)
        if (handleNotConfirm) handleNotConfirm()
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text style={styles.modalText}>{textConfirm}</Text>
          <View style={styles.buttonContainer}>

            <TouchableOpacity
              onPress={()=>{
                setOpenDialog(false)
                handleConfirm()
              }}
              style={[
                styles.button,
                styles.confirmButton
              ]}
            >
              <Text
                style={[
                  styles.textButton,
                  styles.textYesButton
                ]}
              >Si</Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                setOpenDialog(false)
                if (handleNotConfirm) handleNotConfirm()
              }}
              style={[
                styles.button,
                styles.noConfirmButton
              ]}
            >
              <Text
                style={[
                  styles.textButton,
                  styles.textNoButton
                ]}>No</Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
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

  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
    color: "white",
    textAlign: 'center'
  },
  confirmButton: {
    backgroundColor: '#26980C',
  },
  noConfirmButton: {
    backgroundColor: '#ff4444',
  },

  textButton: {
    textAlign:"center",
    fontWeight:"bold"
  },

  textYesButton: {
    color:"#EDEDED"
  },

  textNoButton: {
    color:"#EDEDED"
  },

});

export default Confirm;