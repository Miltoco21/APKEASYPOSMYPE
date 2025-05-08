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
    title = "Titulo",
    showHeader = false,
    children,
    props = {},
    style = {}
}) {

    return (
        <SafeAreaView style={{
            ...styles.container,
            ...style,
        }}
            {...props}>
            <Stack.Screen
                options={{
                    title: "Box",
                    headerTitle: title,
                    headerShown: showHeader,
                }}
            />
            {children}
        </SafeAreaView>
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