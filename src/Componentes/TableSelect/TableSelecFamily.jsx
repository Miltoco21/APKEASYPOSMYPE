import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SmallButton from '../Elements/SmallButton';
import Product from '../../Models/Product';

const TableSelecFamily = ({
  show,
  onSelect,
  onNotFamiliesFound,
  title = 'Elegir familia',
  categoryId,
  subcategoryId,
}) => {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    if (!subcategoryId || !show) return;
    setFamilies([]);

    Product.getInstance().getFamiliaBySubCat(
      {
        categoryId,
        subcategoryId,
      },
      (respuestaServidor) => {
        if (respuestaServidor.length > 0) {
          setFamilies(respuestaServidor);
        } else {
          onNotFamiliesFound();
          setFamilies([]);
        }
      },
      () => {
        onNotFamiliesFound();
        setFamilies([]);
      }
    );
  }, [show, subcategoryId]);

  if (!show) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {families.length > 0 &&
        families.map((family, index) => (
          <SmallButton
            key={index}
            textButton={family.descripcion}
            actionButton={() => onSelect(family)}
            style={{ minHeight: 80 }}
          />
        ))
      }
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

export default TableSelecFamily;
