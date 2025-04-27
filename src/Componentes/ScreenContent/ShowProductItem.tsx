import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import Validator from '../../Helpers/Validator';
import Log from 'src/Models/Log';

const ShowProductItem = ({ item, index, onRefresh = () => { } }) => {
    const { removeFromSalesData, replaceToSalesData, showConfirm } = useContext(SelectedOptionsContext);
    // Usamos una única variable para manejar cantidad o peso

    return (
        <View style={styles.selectedProductRow}>
            <Text style={styles.quantityText}>{item.cantidad}</Text>
            <Text style={styles.selectedProductText}>
                {item.descripcion}
            </Text>
            <Text style={styles.priceText}>
                {item.precioUnidad ? `$${item.precioUnidad}` : '-'}
            </Text>
            <Text style={styles.totalText}>
                {item.precioUnidad ? `$${(item.precioUnidad * item.cantidad)}` : '-'}
            </Text>
        </View>
    );
};

export default ShowProductItem;

const styles = StyleSheet.create({
    selectedProductRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    quantityText: {
        flex: 0.5,
        fontSize: 10,
        color: '#333',
        textAlign: 'center',
        fontWeight: 'bold',
        borderWidth: 1,
        borderRadius: 4,
        padding: 5,
        width: 36,
    },
    selectedProductText: {
        flex: 2,
        fontSize: 8,
        color: '#333',
        paddingHorizontal: 4,
    },
    priceText: {
        flex: 1,
        fontSize: 9,
        color: '#283048',
        textAlign: 'right',
        paddingHorizontal: 4,
    },
    totalText: {
        flex: 1,
        fontSize: 9,
        color: '#283048',
        fontWeight: 'bold',
        textAlign: 'right',
        paddingHorizontal: 4,
    },
});
