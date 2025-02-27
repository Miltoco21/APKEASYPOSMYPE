import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet
} from "react-native";
import { Stack } from "expo-router";

export default function ({
    children
}) {

    return (
       <Text>
        { children }
       </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        padding: 10,
        margin: 0
    }
})