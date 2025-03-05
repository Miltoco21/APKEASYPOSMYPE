import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import ProductsItem from './ProductItem';

const ProductsList = ({
  data,
  onRefresh = ()=>{}
}) => {
  const {

    addToSalesData,
    removeFromSalesData,
    clearSalesData,
    salesDataTimestamp
  } = useContext(SelectedOptionsContext);

  // console.log("data", data)
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item.idProducto}_${index}`}
      contentContainerStyle={{ flexGrow: 1 }}
      renderItem={({ item, index }) => {
        // Se usa 'quantity' si existe, sino se toma 'cantidad'
        // console.log(`Renderizando producto: ${item.nombre} - Cantidad: ${currentQuantity}`);
        return (
          <ProductsItem
            item={item}
            index={index}
            onRefresh={()=>{
            }}
          />
        );
      }}
    />
  );
};

export default ProductsList;

const styles = StyleSheet.create({
  resultsContainer: {
    maxHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    color: '#333',
  },
  productCode: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#283048',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
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
})