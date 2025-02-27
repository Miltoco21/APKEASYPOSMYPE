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
    children,
    item = null,
    xs = null,
    sm = null,
    md = null,
    lg = null,
}) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "limegreen",
        padding: 0,
        margin: 0
    }
})