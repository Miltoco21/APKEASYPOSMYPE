
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecProduct from "../TableSelect/TableSelecProduct";
import Product from "../../Models/Product";
import ModelConfig from "../../Models/ModelConfig";
import ConfirmOption from "../Dialogs/ConfirmOption";
import Log from "src/Models/Log";
import AsignarPeso from "../ScreenDialog/AsignarPeso";
import ProductSold from "src/Models/ProductSold"; // Asegúrate de importar ProductSold

const BoxBusquedaRapida = () => {
  const {
    userData,
    addToSalesData,
    showConfirm,
    showAlert,
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

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null); // Nuevo estado para el producto a agregar

  useEffect(() => {
    setProds([]);
    getProducts();
  }, []);

  const getProducts = () => {
    Product.getInstance().getProductsFastSearch(
      (productosServidor) => {
        completarBotonesFaltantes(productosServidor);
      },
      (error) => {
        console.error("Error al obtener productos:", error);
        setProds([]);
      }
    );
  };

  const completarBotonesFaltantes = async (productosServidor) => {
    const cantConfig = await ModelConfig.get("cantidadProductosBusquedaRapida");
    const botonesByBotonNum = [];

    productosServidor.forEach((prodSer) => {
      if (prodSer.boton <= cantConfig) {
        botonesByBotonNum[prodSer.boton] = prodSer;
      }
    });

    const filledProds = [];
    for (let i = 1; i <= cantConfig; i++) {
      if (!botonesByBotonNum[i]) {
        filledProds.push({
          boton: i,
          codigoProducto: 0,
          nombre: "Botón " + i,
        });
      } else {
        filledProds.push(botonesByBotonNum[i]);
      }
    }

    setProds(filledProds);
  };

  // Función modificada para manejar productos pesables
  const handleAddProduct = (product) => {
    const isPesable = ProductSold.getInstance().esPesable(product);
    
    if (isPesable) {
      setProductToAdd(product);
      setShowWeightModal(true);
    } else {
      addToSalesData({ 
        ...product,
        cantidad: 1,
        total: product.precioVenta * 1 
      }, undefined, true);
    }
  };

  const onSelect = (product) => {
    setIsChanging(false);
    if (product.codigoProducto) {
      product.idProducto = product.codigoProducto;

      showLoading("Agregando...")
      Product.getInstance().findByCodigoBarras(
        {
          codigoProducto: product.codBarra,
          codigoCliente: cliente ? cliente.codigoCliente : 0,
        },
        (prodsEncontrados) => {
          hideLoading()
          if (prodsEncontrados.length < 1) {
            showAlert(
              "No se pudo encontrar el producto, intentando eliminar del listado..."
            );
            Product.getInstance().removeProductFastSearch(
              product,
              (response) => {
                hideLoading();
                showAlert("Eliminado del listado");
                setProds([]);
                getProducts();
              },
              () => {
                hideLoading();
                showAlert("No se pudo realizar");
              }
            );
          } else {
            // Llamamos a la nueva función para manejar la adición
            handleAddProduct(prodsEncontrados[0]);
          }
        },
        (err) => {
          hideLoading()
          showAlert("No se pudo encontrar el producto." + err);
        }
      );
    } else {
      showConfirm(
        "No está configurado este botón, ¿desea configurarlo ahora?",
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
          showAlert("Se ha modificado correctamente");
          setProds([]);
          getProducts();
        },
        () => {
          showAlert("No se pudo modificar");
        }
      );
    } else {
      Product.getInstance().addProductFastSearch(
        findedProductx,
        (response) => {
          showAlert("Se agregó correctamente");
          setProds([]);
          getProducts();
        },
        () => {
          showAlert("No se pudo agregar");
        }
      );
    }
  };

  const handleClearButton = () => {
    showConfirm(
      `¿Limpiar el botón ${settingProduct ? settingProduct.boton : ""} ${settingProduct.nombre
      }?`,
      () => {
        setSettingProduct(null);
        Product.getInstance().removeProductFastSearch(
          settingProduct,
          (response) => {
            showAlert("Realizado correctamente");
            setProds([]);
            getProducts();
          },
          () => {
            showAlert("No se pudo realizar");
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
          const buttonStyle = {
            minHeight: 80,
            backgroundColor: product.codigoProducto ? '#fff' : '#465379',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 5,
            width: '48%',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          };

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => onSelect(product)}
              onLongPress={() => {
                setIsChanging(true);
                if (product.codigoProducto) {
                  setSettingProduct(product);
                  setShowConfirmOption(true);
                }
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  !product.codigoProducto && styles.inactiveButtonText,
                ]}
              >
                {product.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}

      <TableSelecProduct
        style={styles.containerProducts}
        show={showSearchProduct}
        onSelect={handleSelectProduct}
      />

      <ConfirmOption
        openDialog={showConfirmOption}
        setOpenDialog={setShowConfirmOption}
        textTitle={`Opciones del botón ${settingProduct ? settingProduct.boton : ""
          }`}
        textConfirm={`Elija una opción para el botón ${settingProduct
          ? `${settingProduct.boton} con el producto '${settingProduct.nombre}'`
          : " de búsqueda rápida"
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
        buttonOptions={["Modificar", "Liberar"]}
      />
      
      {/* Modal para asignar peso a productos pesables */}
      <AsignarPeso
        visible={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        product={productToAdd}
        currentWeight={0}
        onSave={(peso) => {
          if (productToAdd) {
            const productWithWeight = {
              ...productToAdd,
              cantidad: peso,
              total: productToAdd.precioVenta * peso
            };
            addToSalesData(productWithWeight);
            setShowWeightModal(false);
          }
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buttonContainer: {
    minHeight: 80,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inactiveButton: {
    backgroundColor: "#465379",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  inactiveButtonText: {
    color: "#fff",
  },
  confirmModal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    marginLeft: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  containerProducts: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default BoxBusquedaRapida;