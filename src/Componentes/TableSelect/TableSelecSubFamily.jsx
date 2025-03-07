import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SmallButton from '../Elements/SmallButton';
import Product from '../../Models/Product';

const TableSelecSubFamily = ({
  show,
  onSelect,
  onNotSubfamiliesFound,
  title = 'Elegir sub familia',
  categoryId,
  subcategoryId,
  familyId,
}) => {
  const [subfamilies, setSubFamilies] = useState([]);

  useEffect(() => {
    if (!familyId || !show) return;
    setSubFamilies([]);

    Product.getInstance().getSubFamilia(
      {
        categoryId,
        subcategoryId,
        familyId,
      },
      (respuestaServidor) => {
        if (respuestaServidor.length > 0) {
          setSubFamilies(respuestaServidor);
        } else {
          onNotSubfamiliesFound();
        }
      },
      () => {
        setSubFamilies([]);
        onNotSubfamiliesFound();
      }
    );
  }, [show, familyId]);

  if (!show) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subfamilies.length > 0 &&
        subfamilies.map((subfamily, index) => (
          <SmallButton
            key={index}
            textButton={subfamily.descripcion}
            actionButton={() => onSelect(subfamily)}
            style={{ minHeight: 80 }}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default TableSelecSubFamily;
