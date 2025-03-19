// import React, { useState, useContext, useEffect } from "react";

// import {
//   Typography,
//   Grid,
//   Button
// } from "@mui/material";
// import ModelConfig from "../../Models/ModelConfig";


// const SmallButton = ({
//   textButton,
//   actionButton = ()=>{},
//   style = {},
//   isDisabled = false,
//   withDelay = true,

//   onTouchStart = ()=>{},
//   onMouseDown = ()=>{},
//   onTouchEnd = ()=>{},
//   onMouseUp = ()=>{},
//   onMouseLeave = ()=>{},
//   onTouchMove = ()=>{},

//   animateBackgroundColor = false

// }) => {
//   const [clickeable, setClickeable] = useState(true);
//   const [colorFondo, setColorFondo] = useState("#283048")

//   const changeBackgroundColor = ()=>{
//     setColorFondo("#0dee8e")
//     setTimeout(() => {
//       setColorFondo("#283048")
//     }, 1000);
//   }

//   return (
//         <Button
//         disabled={isDisabled}
//         sx={{ ...{
//         width: "130px",
//         backgroundColor: colorFondo,
//         color: "white",
//         "&:hover": {
//           backgroundColor: "#1c1b17 ",
//           color: "white",
//         },
//         margin: "5px",
//       }, ...style} }

//         onClick={()=>{
//           if(!clickeable) {
//             return
//           }
//           actionButton()
//           if(withDelay){
//             setClickeable(false);
//             setTimeout(function(){
//               setClickeable(true);
//             },ModelConfig.getInstance().getFirst().buttonDelayClick);
//           }

//           if(animateBackgroundColor){
//             changeBackgroundColor()
//           }
//         }}

//         onTouchStart={()=>{onTouchStart()}}
//         onMouseDown={()=>{onMouseDown()}}
//         onTouchEnd={()=>{onTouchEnd()}}
//         onMouseUp={()=>{onMouseUp()}}
//         onMouseLeave={()=>{onMouseLeave()}}
//         onTouchMove={()=>{onTouchMove()}}


//         >
//           <Typography variant="h7">{textButton}</Typography>
//         </Button>
//   );
// };

// export default SmallButton;
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import ModelConfig from '../../Models/ModelConfig';

const SmallButton = ({
  textButton,
  actionButton = () => {},
  style = {},
  isDisabled = false,
  withDelay = true,
  onTouchStart = () => {},
  onTouchEnd = () => {},
  onTouchMove = () => {},
  animateBackgroundColor = false,
}) => {
  const [clickeable, setClickeable] = useState(true);
  const [colorFondo, setColorFondo] = useState("#465379");

  const changeBackgroundColor = () => {
    setColorFondo("#0dee8e");
    setTimeout(() => {
      setColorFondo("#465379");
    }, 1000);
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.button, { backgroundColor: colorFondo }, style]}
      onPress={() => {
        if (!clickeable) {
          return;
        }
        actionButton();
        if (withDelay) {
          setClickeable(false);
          setTimeout(() => {
            setClickeable(true);
          }, ModelConfig.getInstance().getFirst().buttonDelayClick);
        }
        if (animateBackgroundColor) {
          changeBackgroundColor();
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <Text style={styles.buttonText}>{textButton}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // button: {
  //   width: 130,
  //   margin: 5,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 10,
  //   borderRadius: 4,
  // },
  button:{
    width: "100%",
    minHeight: 80,
    backgroundColor: "#465379",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SmallButton;
