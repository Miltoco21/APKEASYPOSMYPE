import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import AsignarPrecio from '../ScreenDialog/AsignarPrecio';
import AsignarPeso from '../ScreenDialog/AsignarPeso';

const ProductsItem = ({
  item,
  index,
  onDeleteProduct,
  onShowDeleteModal,
  onRefresh = ()=>{}
}) => {
  const {
    addToSalesData,
    removeFromSalesData,
    clearSalesData,
    salesDataTimestamp,
    replaceToSalesData,
    sales
  } = useContext(SelectedOptionsContext);

  const [currentQuantity, setCurrentQuantity] = useState(0)
  const [showModalPeso, setShowModalPeso] = useState(false)


  useEffect(() => {
    setCurrentQuantity(item.quantity || item.cantidad)
  }, [])

  const actualizarPeso = (nuevoPeso)=>{
    item.quantity = nuevoPeso
    replaceToSalesData(index,item)
    setCurrentQuantity(nuevoPeso)
  }

  return (

    <View style={styles.selectedProductRow}>
      <AsignarPeso
        product={item}
        onChange={(nuevoPeso) => {
          actualizarPeso(nuevoPeso)
        }}
        openDialog={showModalPeso}
        setOpenDialog={setShowModalPeso}
        />
      <TouchableOpacity
        onPress={() => {
          setShowModalPeso(true)
        }}
      >
        <Text style={styles.quantityText}>{currentQuantity}</Text>
      </TouchableOpacity>


      <Text style={styles.selectedProductText}>{item.nombre || item.description}</Text>
      <Text style={styles.priceText}>
        {item.precioVenta ? `$${item.precioVenta}` : '-'}
      </Text>
      <Text style={styles.totalText}>
        {item.precioVenta ? `$${(item.precioVenta * currentQuantity)}` : '-'}
      </Text>
      <TouchableOpacity
        onPress={() => {
          onDeleteProduct(index);
          onShowDeleteModal(true);
        }}
      >
        <Ionicons name="trash" size={21} color="#ff4444" />
      </TouchableOpacity>
    </View>)
};

export default ProductsItem;

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