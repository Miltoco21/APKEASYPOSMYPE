import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import TableSelecProduct from '../TableSelect/TableSelecProduct';
import Product from '../../Models/Product';
import ModelConfig from '../../Models/ModelConfig';
import ConfirmOption from '../Dialogs/ConfirmOption';

const BoxBusquedaRapida = () => {
  const {
    userData,
    addToSalesData,
    showConfirm,
    showSnackbarMessage,
    showLoading,
    hideLoading,
    cliente,
  } = useContext(SelectedOptionsContext);

  const [prods, setProds] = useState([]);
  const [showSearchProduct, setShowSearchProduct] = useState(false);
  const [showConfirmOption, setShowConfirmOption] = useState(false);
  const [findedProduct, setFindedProduct] = useState(null);
  const [settingProduct, setSettingProduct] = useState(null);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setProds([]);
    getProducts();
  }, []);

  const getProducts = () => {
  //console.log('Iniciando getProducts');
    Product.getInstance().getProductsFastSearch(
      (productosServidor) => {
        console.log('Productos recibidos del servidor:', productosServidor);
        completarBotonesFaltantes(productosServidor);
      },
      (error) => {
        console.error('Error al obtener productos:', error);
        setProds([]);
      }
    );
  };


  const completarBotonesFaltantes = async (productosServidor) => {
    const cantConfig = await ModelConfig.get('cantidadProductosBusquedaRapida');
    console.log('cantConfig',cantConfig)
    console.log('Completando botones. Cantidad configurada:', cantConfig);
    
    const botonesByBotonNum = [];
    
    // Mapear productos existentesr
    productosServidor.forEach((prodSer) => {
      if (prodSer.boton <= cantConfig) {
        console.log(`Asignando producto ${prodSer.nombre} a botón ${prodSer.boton}`);
        botonesByBotonNum[prodSer.boton] = prodSer;
      }
    });

    // Rellenar botones faltantes
    const filledProds = [];
    for (let i = 1; i <= cantConfig; i++) {
      if (!botonesByBotonNum[i]) {
        console.log(`Creando placeholder para botón ${i}`);
        filledProds.push({
          boton: i,
          codigoProducto: 0,
          nombre: 'Botón ' + i,
        });
      } else {
        filledProds.push(botonesByBotonNum[i]);
      }
    }
    
    console.log('Productos finales para renderizar:', filledProds);
    setProds(filledProds);
  };
  // const completarBotonesFaltantes = (productosServidor) => {
  //   const cantConfig = ModelConfig.get('cantidadProductosBusquedaRapida');
  //   console.log('Completando botones. Cantidad configurada:', cantConfig);

  //   const botonesByBotonNum = [];
  //   productosServidor.forEach((prodSer) => {
  //     if (prodSer.boton <= cantConfig)
  //       botonesByBotonNum[prodSer.boton] = prodSer;
  //   });

  //   for (let i = 1; i <= cantConfig; i++) {
  //     if (botonesByBotonNum[i] === undefined) {
  //       botonesByBotonNum[i] = {
  //         boton: i,
  //         codigoProducto: 0,
  //         nombre: 'Botón ' + i,
  //       };
  //     }
  //   }
  //   setProds(botonesByBotonNum);
  // };

  const onSelect = (product) => {
    setIsChanging(false);
    if (product.codigoProducto) {
      product.idProducto = product.codigoProducto;

      Product.getInstance().findByCodigoBarras(
        {
          codigoProducto: product.codBarra,
          codigoCliente: cliente ? cliente.codigoCliente : 0,
        },
        (prodsEncontrados) => {
          if (prodsEncontrados.length < 1) {
            showLoading(
              'No se pudo encontrar el producto, intentando eliminar del listado...'
            );
            Product.getInstance().removeProductFastSearch(
              product,
              (response) => {
                hideLoading();
                showSnackbarMessage('Eliminado del listado');
                setProds([]);
                getProducts();
              },
              () => {
                hideLoading();
                showSnackbarMessage('No se pudo realizar');
              }
            );
          } else {
            addToSalesData(prodsEncontrados[0]);
          }
        },
        (err) => {
          showSnackbarMessage('No se pudo encontrar el producto.' + err);
        }
      );
    } else {
      showConfirm(
        'No está configurado este botón, ¿desea configurarlo ahora?',
        () => {
          setSettingProduct(product);
          setShowSearchProduct(true);
        }
      );
    }
  };

  const handleSelectProduct = (findedProductx) => {
    setShowSearchProduct(false);
    setFindedProduct(findedProductx);

    findedProductx.codigoProducto = findedProductx.idProducto;
    findedProductx.codigoUsuario = userData.codigoUsuario;
    findedProductx.boton = settingProduct.boton;

    if (isChanging) {
      findedProductx.id = settingProduct.id;
      Product.getInstance().changeProductFastSearch(
        findedProductx,
        (response) => {
          showSnackbarMessage('Se ha modificado correctamente');
          setProds([]);
          getProducts();
        },
        () => {
          showSnackbarMessage('No se pudo modificar');
        }
      );
    } else {
      Product.getInstance().addProductFastSearch(
        findedProductx,
        (response) => {
          showSnackbarMessage('Se agregó correctamente');
          setProds([]);
          getProducts();
        },
        () => {
          showSnackbarMessage('No se pudo agregar');
        }
      );
    }
  };

  const handleClearButton = () => {
    showConfirm(
      `¿Limpiar el botón ${settingProduct ? settingProduct.boton : ''} ${
        settingProduct.nombre
      }?`,
      () => {
        setSettingProduct(null);
        Product.getInstance().removeProductFastSearch(
          settingProduct,
          (response) => {
            showSnackbarMessage('Realizado correctamente');
            setProds([]);
            getProducts();
          },
          () => {
            showSnackbarMessage('No se pudo realizar');
          }
        );
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
      {!showSearchProduct &&
        prods.length > 0 &&
        prods.map((product, index) => {
          const styles = {
            minHeight: 80,
            backgroundColor: product.codigoProducto ? '#fff' : '#465379',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 5,
             width: '48%',
          };

          return (
            <TouchableOpacity
              key={index}
              style={styles}
              onPress={() => onSelect(product)}
              onLongPress={() => {
                setIsChanging(true);
                if (product.codigoProducto) {
                  setSettingProduct(product);
                  setShowConfirmOption(true);
                 
                  
                }
              }}
            >
              <Text style={styles.buttonText}>{product.nombre}</Text>
            </TouchableOpacity>
          );
        })}

      <TableSelecProduct
        show={showSearchProduct}
        onSelect={handleSelectProduct}
      />

      <ConfirmOption
        openDialog={showConfirmOption}
        setOpenDialog={setShowConfirmOption}
        textTitle={`Opciones del botón ${
          settingProduct ? settingProduct.boton : ''
        }`}
        textConfirm={`Elija una opción para el botón ${
          settingProduct
            ? `${settingProduct.boton} con el producto '${settingProduct.nombre}'`
            : ' de búsqueda rápida'
        }`}
        onClick={(option) => {
          switch (option) {
            case 0:
              setShowSearchProduct(true);
              break;
            case 1:
              handleClearButton();
              break;
          }
        }}
        buttonOptions={['Modificar', 'Liberar']}
      />
    </ScrollView>
  );}
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 15,
      backgroundColor: '#f5f5f5',
      flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    },
    buttonContainer: {
      minHeight: 80,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderRadius: 5,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      
    },
    inactiveButton: {
      backgroundColor: '#465379',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    inactiveButtonText: {
      color: '#fff',
    },
    // Estilos para el modal de confirmación (si lo descomentas)
    confirmModal: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      margin: 20,
      padding: 20,
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalButton: {
      marginLeft: 15,
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
  });
  
  export default BoxBusquedaRapida;