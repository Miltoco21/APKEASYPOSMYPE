// import React, { useState, useContext, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Box,
//   Grid,
//   CircularProgress,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import System from "../../Helpers/System";
// import TeclaButton from "./../Elements/TeclaButton"
// import TeclaEnterButton from "./../Elements/TeclaEnterButton"
// import TeclaBorrarButton from "./../Elements/TeclaBorrarButton"
// import TeclaOkButton from "../Elements/TeclaOkButton";
// // import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

// const TecladoPrecio = ({
//   showFlag,
//   varValue, 
//   varChanger, 
//   onEnter,
//   onChange = null,
//   maxValue = 10000000
// }) => {

//   // const { 
//   //   showMessage
//   // } = useContext(SelectedOptionsContext);

//   const showMessage = (message)=>{
//     alert(message)
//   }

//   const handleKeyButton = (key)=>{
    
//     if(key == "enter"){
//       onEnter()
//       return
//     }
    
//     if(key == "borrar"){
//       var nuevoValor = (varValue + "").slice(0, -1);
//       if(nuevoValor == ""){
//         nuevoValor = "0"
//       }
//       varChanger( nuevoValor )
//       return
//     }
//     if(key.toLowerCase() == "limpiar"){
//       varChanger( "0" )
//        return
//     }

//     const valorAnteriorValido = (parseInt(varValue)> 0)?varValue:""
//     var nuevoValor = valorAnteriorValido + ""  + key

//     if(parseInt(nuevoValor)>maxValue){
//       showMessage("Valor muy grande");
//       return
//     }

//     if(onchange != null){
//       const changeCustom = onchange(nuevoValor)
//       if( changeCustom != undefined){
//         varChanger(changeCustom)
//       }else{
//         varChanger(nuevoValor)
//       }
//      }else{
//       varChanger( nuevoValor )
//      }
//   }

//   return (
//     showFlag ? (
//     <div style={{

//       // width: "370px",
//       padding: "10px",
//       // background: "transparent",
//       // position: "fixed",
//       // left: "calc(50% - 111px)",
//       // bottom: "50px",
//       // zIndex: "10",
//       display: "flex",
//       alignContent: "center",
//       alignItems: "start",
//       flexDirection:"column"

//     }}>



//     <div style={{
//       display:"flex",
//       flexDirection:"row"
//     }}>

//       <TeclaButton textButton="LIMPIAR" style={{
//         width: "150px",
//         height: "70px",
//         padding:"10px 0",
//         backgroundColor:"#f05a5a",
//         color:"white"
//         }} actionButton={handleKeyButton} />
//       <TeclaBorrarButton style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />


//     </div>

//     <div style={{
//         display:"flex",
//         flexDirection:"row"
//       }}>

//       <TeclaButton textButton="1" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
//       <TeclaButton textButton="2" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
//       <TeclaButton textButton="3" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />

     

//     </div>



//       <div style={{
//         display:"flex",
//         flexDirection:"row"
//       }}>


//       <TeclaButton textButton="4" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
//       <TeclaButton textButton="5" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
//       <TeclaButton textButton="6" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />

//       </div>


//       <div style={{
//         display:"flex",
//         flexDirection:"row"
//       }}>

//       <TeclaButton textButton="7" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
//       <TeclaButton textButton="8" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
//       <TeclaButton textButton="9" style={{width: "70px",height: "70px",}} actionButton={handleKeyButton} />
      
//       </div>

//       <div style={{
//         display:"flex",
//         flexDirection:"row"
//       }}>
      
//       <TeclaButton style={{width: "70px",height: "70px",}} textButton="0" actionButton={handleKeyButton} />
//       <TeclaButton style={{width: "70px",height: "70px",}} textButton="00" actionButton={handleKeyButton} />
//       <TeclaButton style={{
//         width: "70px",height: "70px",
//         padding:"10px 0"
//         }} textButton="000" actionButton={handleKeyButton} />


//     </div>
//     </div>
//   ) : (
//     <></>
//   )
// )
// };

// export default TecladoPrecio;
import React from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const TecladoPrecio = ({
  showFlag,
  varValue,
  varChanger,
  onEnter,
  onChange = null,
  maxValue = 10000000,
}) => {
  const showMessage = (message) => {
    Alert.alert("Aviso", message);
  };

  const handleKeyButton = (key) => {
    if (key === "enter") {
      onEnter();
      return;
    }

    if (key === "borrar") {
      let nuevoValor = (varValue + "").slice(0, -1);
      if (nuevoValor === "") {
        nuevoValor = "0";
      }
      varChanger(nuevoValor);
      return;
    }

    if (key.toLowerCase() === "limpiar") {
      varChanger("0");
      return;
    }

    const valorAnteriorValido = parseInt(varValue) > 0 ? varValue : "";
    let nuevoValor = valorAnteriorValido + key;

    if (parseInt(nuevoValor) > maxValue) {
      showMessage("Valor muy grande");
      return;
    }

    if (onChange) {
      const changeCustom = onChange(nuevoValor);
      varChanger(changeCustom !== undefined ? changeCustom : nuevoValor);
    } else {
      varChanger(nuevoValor);
    }
  };

  if (!showFlag) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          mode="contained"
          buttonColor="#f05a5a"
          textColor="white"
          style={styles.largeButton}
          onPress={() => handleKeyButton("limpiar")}
        >
          LIMPIAR
        </Button>
        <Button mode="contained" style={styles.button} onPress={() => handleKeyButton("borrar")}>
          ⌫
        </Button>
      </View>

      {[["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["0", "00", "000"]].map(
        (row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key) => (
              <Button key={key} mode="contained" style={styles.button} onPress={() => handleKeyButton(key)}>
                {key}
              </Button>
            ))}
          </View>
        )
      )}

      <Button mode="contained" buttonColor="#4CAF50" textColor="white" style={styles.enterButton} onPress={() => handleKeyButton("enter")}>
        OK
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  button: {
    width: 70,
    height: 70,
    justifyContent: "center",
  },
  largeButton: {
    width: 150,
    height: 70,
    justifyContent: "center",
  },
  enterButton: {
    marginTop: 10,
    width: 150,
    height: 70,
  },
});

export default TecladoPrecio;
