import React, { useContext } from 'react';
import { View,Text } from 'react-native';
import BoxFamilias from '../BoxContent/BoxFamilias';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';

const BoxProductoFamilia = () => {
  const {
    userData,
    addToSalesData,
    showConfirm,
    showMessage,
    showLoading,
    hideLoading,
    cliente
  } = useContext(SelectedOptionsContext);

  const handleSelectProduct = (product) => {
    addToSalesData(product);
  };

  return (
    <View>
    
      <BoxFamilias onSelect={handleSelectProduct} />
    </View>
  );
};

export default BoxProductoFamilia;
