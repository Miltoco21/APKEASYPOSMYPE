import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SmallButton from '../Elements/SmallButton';
import Product from '../../Models/Product';
import System from '../../Helpers/System';

const TableSelecProductNML = ({
  show,
  onSelect,
  categoryId,
  subcategoryId,
  familyId,
  subfamilyId,
  title = 'Elegir producto',
  excludeIfText = '',
  includeOnlyText = '',
  replaceText = '', // separado por coma: primero lo que quita, luego lo que agrega
}) => {
  const [productsNML, setProductsNML] = useState([]);

  useEffect(() => {
    if (!show) return;
    setProductsNML([]);

    Product.getInstance().getProductsNML(
      {
        catId: categoryId,
        subcatId: subcategoryId,
        famId: familyId,
        subFamId: subfamilyId,
      },
      (respuestaServidor) => {
        setProductsNML(respuestaServidor);
      },
      () => {
        setProductsNML([]);
      }
    );
  }, [show, subcategoryId]);

  const isExcluded = (text) => {
    let excludeIfTextArr = [];
    if (typeof excludeIfText === 'string') {
      excludeIfTextArr.push(excludeIfText);
    } else {
      excludeIfTextArr = excludeIfText;
    }

    let exclude = false;
    excludeIfTextArr.forEach((excludeItem) => {
      if (excludeItem !== '' && text.indexOf(excludeItem) > -1) {
        exclude = true;
      }
    });

    return exclude;
  };

  const isIncluded = (text) => {
    let includeTextArr = [];
    if (typeof includeOnlyText === 'string') {
      includeTextArr.push(includeOnlyText);
    } else {
      includeTextArr = includeOnlyText;
    }

    let include = false;
    includeTextArr.forEach((includeItem) => {
      if (includeItem !== '' && text.indexOf(includeItem) > -1) {
        include = true;
      }
    });

    return include;
  };

  const aplicarReemplazos = (texto) => {
    let reemplazosArr = [];
    if (typeof replaceText === 'string') {
      reemplazosArr.push(replaceText);
    } else {
      reemplazosArr = replaceText;
    }

    let textoReemplazado = texto;

    if (reemplazosArr.length > 0) {
      reemplazosArr.forEach((reem) => {
        if (reem.indexOf(',') > -1) {
          const replaces = reem.split(',');
          const replaceOut = replaces[0];
          const replacePut = replaces[1];
          textoReemplazado = textoReemplazado.replace(replaceOut, replacePut);
        }
      });
    }

    return textoReemplazado;
  };

  if (!show) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {productsNML.length > 0 &&
        productsNML.map((product, index) => {
          let display = !isExcluded(product.nombre);
          if (includeOnlyText !== '' && includeOnlyText.length > 0) {
            display = isIncluded(product.nombre);
          }
          const textButton = aplicarReemplazos(product.nombre);

          return (
            display ? (
              <SmallButton
                key={index}
                textButton={textButton}
                actionButton={() => onSelect(System.clone(product))}
                style={{ minHeight: 80 }}
                animateBackgroundColor={true}
              />
            ) : null
          );
        })}
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

export default TableSelecProductNML;
