import React, { useContext, useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

// OptionType {
//   id:String,
//   value:String
// }

const BoxOptionList = ({
  optionSelected,
  setOptionSelected,
  options = []
}) => {

  // useEffect(() => {
  //   console.log("options", options)
  // }, [])

  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      marginVertical:5
    }}>
      {options.map((option, ix) => {
        return (
          <Button key={ix}
            mode={optionSelected == option.id ? "contained" : "outlined"}
            onPress={() => setOptionSelected(option.id)}

            style={{
              borderRadius:2
            }}
          >
            {option.value}
          </Button>
        )
      })}
    </View>
  );
};

export default BoxOptionList;
