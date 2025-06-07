// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import SmallButton from '../Elements/SmallButton';
// import Product from '../../Models/Product';
// import System from '../../Helpers/System';
// import ProductSold from 'src/Models/ProductSold';
// import AsignarPeso from '../ScreenDialog/AsignarPeso';

// const TableSelecProductNML = ({
//   show,
//   onSelect,
//   categoryId,
//   subcategoryId,
//   familyId,
//   subfamilyId,
//   title = 'Elegir producto',
//   excludeIfText = '',
//   includeOnlyText = '',
//   replaceText = '', // separado por coma: primero lo que quita, luego lo que agrega
// }) => {
//   const [productsNML, setProductsNML] = useState([]);

//   useEffect(() => {
//     if (!show) return;
//     setProductsNML([]);

//     Product.getInstance().getProductsNML(
//       {
//         catId: categoryId,
//         subcatId: subcategoryId,
//         famId: familyId,
//         subFamId: subfamilyId,
//       },
//       (respuestaServidor) => {
//         setProductsNML(respuestaServidor);
//       },
//       () => {
//         setProductsNML([]);
//       }
//     );
//   }, [show, subcategoryId]);

//   const isExcluded = (text) => {
//     let excludeIfTextArr = [];
//     if (typeof excludeIfText === 'string') {
//       excludeIfTextArr.push(excludeIfText);
//     } else {
//       excludeIfTextArr = excludeIfText;
//     }

//     let exclude = false;
//     excludeIfTextArr.forEach((excludeItem) => {
//       if (excludeItem !== '' && text.indexOf(excludeItem) > -1) {
//         exclude = true;
//       }
//     });

//     return exclude;
//   };

//   const isIncluded = (text) => {
//     let includeTextArr = [];
//     if (typeof includeOnlyText === 'string') {
//       includeTextArr.push(includeOnlyText);
//     } else {
//       includeTextArr = includeOnlyText;
//     }

//     let include = false;
//     includeTextArr.forEach((includeItem) => {
//       if (includeItem !== '' && text.indexOf(includeItem) > -1) {
//         include = true;
//       }
//     });

//     return include;
//   };

//   const aplicarReemplazos = (texto) => {
//     let reemplazosArr = [];
//     if (typeof replaceText === 'string') {
//       reemplazosArr.push(replaceText);
//     } else {
//       reemplazosArr = replaceText;
//     }

//     let textoReemplazado = texto;

//     if (reemplazosArr.length > 0) {
//       reemplazosArr.forEach((reem) => {
//         if (reem.indexOf(',') > -1) {
//           const replaces = reem.split(',');
//           const replaceOut = replaces[0];
//           const replacePut = replaces[1];
//           textoReemplazado = textoReemplazado.replace(replaceOut, replacePut);
//         }
//       });
//     }

//     return textoReemplazado;
//   };

//   if (!show) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{title}</Text>
//       {productsNML.length > 0 &&
//         productsNML.map((product, index) => {
//           let display = !isExcluded(product.nombre);
//           if (includeOnlyText !== '' && includeOnlyText.length > 0) {
//             display = isIncluded(product.nombre);
//           }
//           const textButton = aplicarReemplazos(product.nombre);

//           return (
//             display ? (
//               <SmallButton
//                 key={index}
//                 textButton={textButton}
//                 actionButton={() => onSelect(System.clone(product))}
//                 style={{ minHeight: 55,padding:3 }}
//                 animateBackgroundColor={true}
//               />
//             ) : null
//           );
//         })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 3,
//   },
// });

// export default TableSelecProductNML;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal,ScrollView } from 'react-native'; // Agregar Modal
import SmallButton from '../Elements/SmallButton';
import Product from '../../Models/Product';
import System from '../../Helpers/System';
import AsignarPeso from '../ScreenDialog/AsignarPeso'; // Importar el componente de asignación de peso
import ProductSold from '../../Models/ProductSold'; // Importar para verificar productos pesables

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
  const [selectedProduct, setSelectedProduct] = useState(null); // Para almacenar el producto seleccionado
  const [showWeightModal, setShowWeightModal] = useState(false); // Controlar visibilidad del modal

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

  const handleSelectProduct = (product) => {
    // Verificar si el producto es pesable
    const isPesable = ProductSold.getInstance().esPesable(product);
    
    if (isPesable) {
      // Si es pesable, guardar el producto y abrir modal de peso
      setSelectedProduct(product);
      setShowWeightModal(true);
    } else {
      // Si no es pesable, llamar a onSelect directamente
      onSelect({
        ...product,
        cantidad: 1,
        total: product.precioVenta
      });
    }
  };

  const handleWeightSave = (peso) => {
    if (selectedProduct) {
      // Crear producto con peso asignado
      const productWithWeight = {
        ...selectedProduct,
        cantidad: peso,
        total: selectedProduct.precioVenta * peso
      };
      
      // Llamar a onSelect con el producto modificado
      onSelect(productWithWeight);
      
      // Cerrar modal y resetear estado
      setShowWeightModal(false);
      setSelectedProduct(null);
    }
  };

  if (!show) return null;

  return (
    <ScrollView style={styles.container}>
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
                actionButton={() => handleSelectProduct(System.clone(product))}
                style={{ minHeight: 55,padding:3 }}
                animateBackgroundColor={true}
              />
            ) : null
          );
        })}
      
      {/* Modal para asignar peso */}
      <AsignarPeso
        visible={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        product={selectedProduct}
        currentWeight={0} // Peso inicial 0
        onSave={handleWeightSave}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 3,
    height:660
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
});

export default TableSelecProductNML;