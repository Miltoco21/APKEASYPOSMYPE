import {
  StyleSheet,
} from "react-native";

const STYLES: any = {}

STYLES.TEXT = {}
STYLES.TEXT = StyleSheet.create({
  // BUTTONS
  BUTTON_MID: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    textShadowColor: 'rgba(51 51 51 / 0.75)', // Black shadow with 75% opacity
    textShadowOffset: { width: -1, height: 1 }, // 2 pixels left, 2 pixels down
    textShadowRadius: 2, // 5 pixels blur radius
    textTransform: "uppercase",
    marginTop: 10,
  },
  BUTTON_ACTION: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: 'rgba(51 51 51 / 0.75)', // Black shadow with 75% opacity
    textShadowOffset: { width: -1, height: 1 }, // 2 pixels left, 2 pixels down
    textShadowRadius: 2, // 5 pixels blur radius
    textTransform: "uppercase",
    fontSize: 16,
  },
  
  TITLE: {
    color: "black",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 15,
    fontWeight: "bold",
  }
})

STYLES.BUTTON = StyleSheet.create({
  PRIMARY: {
    backgroundColor: "rgb(42 1 165)",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    margin: 2
  },

  SECONDARY: {
    backgroundColor: "#c0c",
    borderRadius: 10,
    margin: 2
  },

  ACTION: {
    backgroundColor: "rgb(88 205 4)",
    borderRadius: 10,
    alignItems: "center",//align horizontal
    justifyContent: "center",//align vertical
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginRight: 10,
  },
})


export default STYLES