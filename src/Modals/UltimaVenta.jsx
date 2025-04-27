import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SelectedOptionsContext } from '../Componentes/Context/SelectedOptionsProvider';
import Product from '../Models/Product';
import NewProductModal from './NewProductModal'; // Asegúrate de que la ruta sea la correcta
import Blu from '@/Pages/Blu';
import { Button } from 'react-native-paper';
import LastSale from 'src/Models/LastSale';
import GrillaProductosVendidos from 'src/Componentes/BoxContent/GrillaProductosVendidos';
import SmallButton from 'src/Componentes/Elements/SmallButton';
import SmallDangerButton from 'src/Componentes/Elements/SmallDangerButton';
import SmallGrayButton from 'src/Componentes/Elements/SmallGrayButton';
import ModelConfig from 'src/Models/ModelConfig';
import PrinterBluetooth from 'src/Models/PrinterBluetooth';

const UltimaVenta = ({ visible, onCancel }) => {
  const {
    userData,
    showAlert,
    addToSalesData
  } = useContext(SelectedOptionsContext);


  const [lastSaleProducts, setlastSaleProducts] = useState([])
  const [total, settotal] = useState(0)
  const [subtotal, setsubtotal] = useState(0)
  const [redondeo, setredondeo] = useState(0)
  const [vuelto, setvuelto] = useState(0)
  const [lastSaleInfo, setlastSaleInfo] = useState(null)

  const [canReprint, setcanReprint] = useState(false)

  const cargarInfo = async () => {
    const lastSaleInfox = await LastSale.loadFromSesion()
    setlastSaleInfo(lastSaleInfox)
    if (lastSaleInfox) {
      setlastSaleProducts(lastSaleInfox.data.products)
      var total = 0
      // lastSaleInfox.data.products.forEach((prod,ix)=>{
      //   total += prod.cantidad * prod.precioUnidad
      // })

      setsubtotal(lastSaleInfox.data.subtotal)
      setredondeo(lastSaleInfox.data.redondeo)
      setvuelto(lastSaleInfox.data.vuelto)
      settotal(lastSaleInfox.data.totalPagado)

      // console.log("revisando si se puede reimprimir")
      if (lastSaleInfox.response) {
        const keyItems = Object.keys(lastSaleInfox.response.imprimirResponse)
        const hasToProcess = keyItems.length
        if (hasToProcess > 0) {
          var hasToPrint = false
          keyItems.forEach((itPrint) => {
            // console.log("item:", itPrint)
            // console.log("valor:", (lastSaleInfox.response.imprimirResponse[itPrint]).trim())
            if ((lastSaleInfox.response.imprimirResponse[itPrint]).trim() != "") {
              // console.log("tiene algo")
              hasToPrint = true
            }
          })
          setcanReprint(hasToPrint)
        } else {
          setcanReprint(false)
        }
      } else {
        showMessage("No se pudo guardar la respuesta de ultima venta")
      }
    } else {
      showMessage("Debe hacer una venta")
      onCancel()
    }
  }
  useEffect(() => {
    if (!visible) {
      return
    }

    cargarInfo()
    PrinterBluetooth.prepareBluetooth()
  }, [visible])


  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>


            <View style={styles.content}>
              <Text>Ultima venta</Text>
            </View>
            <View style={styles.content}>
              <GrillaProductosVendidos
                productsSold={lastSaleProducts}
                subtotal={subtotal}
                redondeo={redondeo}
                vuelto={vuelto}
                total={total}
              />
            </View>

            <View style={styles.content}>
              <SmallButton actionButton={() => {
                onCancel()
              }}
                textButton={"Cerrar"} />

              <SmallGrayButton actionButton={async () => {
                const cantidad = await ModelConfig.get("cantidadTicketImprimir");
                const cantAImprimir = parseInt(cantidad);

                  PrinterBluetooth.printAll(lastSaleInfo.data, lastSaleInfo.response);

              }}
                textButton={"Reimprimir ticket"} />

            </View>

          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    flexDirection: "column",
    display: "flex",
    height: "80%"
  },
  content: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 10
  },

  button: {
    backgroundColor: "#283048",
    borderRadius: 4,
    marginRight: 2,
  }
});

export default UltimaVenta;
