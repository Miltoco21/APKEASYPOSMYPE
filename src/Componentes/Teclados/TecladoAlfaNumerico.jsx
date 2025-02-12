// import React, { useState, useContext, useEffect } from "react";
// import TeclaButton70 from "./../Elements/TeclaButton70"
// import TeclaEnterButton70 from "./../Elements/TeclaEnterButton70"
// import TeclaBorrarButton70 from "./../Elements/TeclaBorrarButton70"

// const TecladoAlfaNumerico = ({
//   showFlag, varValue,
//   varChanger,
//   onEnter,
//   isEmail = false,
//   isUrl = false,
//   style = {},
// }) => {

//   const handleKeyButton = (key) => {
//     // console.log("apreta una tecla")
//     if (key == "enter") {
//       onEnter()
//       return
//     }

//     if (key == "limpiar") {
//       varChanger("")
//       return
//     }

//     if (key == "borrar") {
//       varChanger(varValue.slice(0, -1))
//       return
//     }

//     varChanger(varValue + key)
//   }

//   return (
//     showFlag ? (
//       <div style={{
//         ...{
//           height: "400px",
//           position: "fixed",
//           zIndex: "10",
//           background: "#efefef",
//           alignContent: "center",
//           alignItems: "start",
//           flex: "1",
//           left: "calc(50% - 400px)",
//           bottom: "10px",
//           flexDirection: "column"
//         }, ...style
//       }}
//       >
//         <div style={{
//           display: "flex",
//           flexDirection: "row"
//         }}>

//           <TeclaButton70 textButton="1" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="2" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="3" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="4" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="5" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="6" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="7" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="8" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="9" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="0" actionButton={handleKeyButton} />
//         </div>

//         <div style={{
//           display: "flex",
//           flexDirection: "row"
//         }}>

//           <TeclaButton70 textButton="q" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="w" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="e" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="r" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="t" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="y" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="u" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="i" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="o" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="p" actionButton={handleKeyButton} />
//         </div>



//         <div style={{
//           display: "flex",
//           flexDirection: "row"
//         }}>


//           <TeclaButton70 textButton="a" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="s" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="d" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="f" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="g" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="h" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="j" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="k" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="l" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="ñ" actionButton={handleKeyButton} />
//         </div>


//         <div style={{
//           display: "flex",
//           flexDirection: "row"
//         }}>

//           <TeclaButton70 textButton="z" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="x" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="c" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="v" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="b" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="n" actionButton={handleKeyButton} />
//           <TeclaButton70 textButton="m" actionButton={handleKeyButton} />
//           <TeclaBorrarButton70 actionButton={handleKeyButton} />

//           <TeclaEnterButton70 style={{
//             width: "150px"
//           }} actionButton={handleKeyButton} />

//         </div>

//         {isUrl && (

//           <div style={{
//             display: "flex",
//             flexDirection: "row"
//           }}>

//             <TeclaButton70 textButton="." actionButton={handleKeyButton} />
//             <TeclaButton70 textButton=":" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="/" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="-" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="?" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="&" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="=" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="_" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="#" actionButton={handleKeyButton} />
//             <TeclaButton70 textButton="+" actionButton={handleKeyButton} />
//           </div>
//         )}

//         {
//           !isEmail && (
//             <div style={{
//               display: "flex",
//               flexDirection: "row"
//             }}>
//               <TeclaButton70 style={{
//                 width: "100%"
//               }} textButton="Espacio" actionButton={() => {
//                 handleKeyButton(" ")
//               }} />
//             </div>
//           )
//         }

//         {
//           isEmail && (
//             <div style={{
//               display: "flex",
//               flexDirection: "row"
//             }}>
//               <TeclaButton70 style={{
//                 width: "10%"
//               }} textButton="@" actionButton={() => {
//                 handleKeyButton("@")
//               }} />

//               <TeclaButton70 style={{
//                 width: "80%",
//                 backgroundColor: "#f05a5a",
//                 color: "white"
//               }} textButton="Limpiar" actionButton={() => {
//                 handleKeyButton("limpiar")
//               }} />
//               <TeclaButton70 style={{
//                 width: "10%"
//               }} textButton="." actionButton={() => {
//                 handleKeyButton(".")
//               }} />
//             </div>
//           )
//         }
//       </div>
//     ) : (
//       <></>
//     )
//   )
// };

// export default TecladoAlfaNumerico;

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const TecladoAlfaNumerico = ({ showFlag, handleKeyButton, isUrl, isEmail }) => {
  if (!showFlag) return null;

  const renderRow = (keys) => (
    <View style={styles.row}>
      {keys.map((key, index) => (
        <Button key={index} mode="contained" onPress={() => handleKeyButton(key)} style={styles.button}>
          {key}
        </Button>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderRow(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])}
        {renderRow(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'])}
        {renderRow(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'])}
        {renderRow(['z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫', '⏎'])}

        {isUrl && renderRow(['.', ':', '/', '-', '?', '&', '=', '_', '#', '+'])}

        {!isEmail && (
          <View style={styles.row}>
            <Button mode="contained" onPress={() => handleKeyButton(' ')} style={[styles.button, styles.spaceButton]}>
              Espacio
            </Button>
          </View>
        )}

        {isEmail && (
          <View style={styles.row}>
            <Button mode="contained" onPress={() => handleKeyButton('@')} style={styles.smallButton}>
              @
            </Button>
            <Button mode="contained" onPress={() => handleKeyButton('limpiar')} style={styles.clearButton}>
              Limpiar
            </Button>
            <Button mode="contained" onPress={() => handleKeyButton('.')} style={styles.smallButton}>
              .
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    position: 'absolute',
    bottom: 10,
    left: '10%',
    width: '80%',
    backgroundColor: '#efefef',
    zIndex: 10,
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  button: {
    margin: 2,
    flex: 1,
  },
  smallButton: {
    flex: 0.2,
    margin: 2,
  },
  spaceButton: {
    flex: 1,
  },
  clearButton: {
    flex: 0.6,
    backgroundColor: '#f05a5a',
  },
});

export default TecladoAlfaNumerico;
