import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SmallButton from '../Elements/SmallButton';
import Product from '../../Models/Product';

const TableSelecSubCategory = ({
  show,
  onSelect,
  onNotSubcategoriesFound,
  title = "Elegir sub categoria",
  categoryId
}) => {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (!categoryId || !show) return;
    setSubcategories([]);
    Product.getInstance().getSubCategories(
      categoryId,
      (respuestaServidor) => {
        if (respuestaServidor.length > 0) {
          setSubcategories(respuestaServidor);
        } else {
          onNotSubcategoriesFound();
        }
      },
      () => {
        setSubcategories([]);
        onNotSubcategoriesFound();
      }
    );
  }, [show, categoryId]);

  if (!show) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subcategories.length > 0 &&
        subcategories.map((subcategory, index) => (
          <SmallButton
            key={index}
            textButton={subcategory.descripcion}
            actionButton={() => onSelect(subcategory)}
            style={{ minHeight: 56, padding:2 }}
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
});

export default TableSelecSubCategory;
