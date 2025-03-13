import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';

// Importar el contexto y helpers/modelos personalizados
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';
import System from '../../Helpers/System';
import PagoBoleta from '../../Models/PagoBoleta';
import TecladoPagoCaja from '../Teclados/TecladoPagoCaja'///// reemplaza tevlano cuano no tinene
import BoxEntregaEnvases from "./BoxEntregaEnvases";
import BoxPagos from './BoxPagos';
import BoxMultiPago from './BoxMultiPago';
//import IngresarTexto from '../ScreenDialog/IngresarTexto'; debe quedar vacion reemplza teclado
import Printer from '../../Models/Printer';
import LastSale from '../../Models/LastSale';
import ModelConfig from '../../Models/ModelConfig';
import UserEvent from '../../Models/UserEvent';
import Model from '../../Models/Model';
import Oferta5 from '../../Models/Oferta5';
import ProductSold from '../../Models/ProductSold';
import { Button } from 'react-native-paper';
import Log from 'src/Models/Log';

const BoxBoleta = ({ onClose, visible }) => {
  const {
    userData,
    salesData,
    grandTotal,
    setSelectedUser,
    setTextSearchProducts,
    clearSalesData,
    cliente,
    setCliente,
    setAskLastSale,
    showMessage,
    showLoading,
    hideLoading,
    setShowDialogSelectClient,
    modoAvion,
    showAlert,
    setUltimoVuelto
  } = useContext(SelectedOptionsContext);

  // Estados locales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagarCon, setPagarCon] = useState(0);
  const [vuelto, setVuelto] = useState(0);
  const [redondeo, setRedondeo] = useState(0);
  const [productosConEnvases, setProductosConEnvases] = useState([]);
  const [descuentoEnvases, setDescuentoEnvases] = useState(0);
  const [tieneEnvases, settieneEnvases] = useState(false);
  const [totalYDescuentoYRedondeo, setTotalYDescuentoYRedondeo] = useState(0);
  const [cambioManualTeclado, setCambioManualTeclado] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [totalPagos, setTotalPagos] = useState(0);
  const [aplicaRedondeo, setAplicaRedondeo] = useState(false);
  const [faltaPagar, setFaltaPagar] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [trabajaConComanda, setTrabajaConComanda] = useState(false);
  const [nombreClienteComanda, setNombreClienteComanda] = useState("");
  const [showNombreComanda, setShowNombreComanda] = useState(false);

  // Función para aplicar ofertas
  const aplicarOfertas = async () => {
    // console.log("aplicando ofertas");
    // Log("salesData", salesData)


    await Model.getOfertas((ofertas) => {
      if (ofertas.length > 0) {
        ofertas.forEach((ofer) => {
          if (ofer.tipo === 5) {
            let copiaProductos = salesData;
            Oferta5.setInfo(ofer);
            let resultadoOfertas = {
              productosQueAplican: [],
              productosQueNoAplican: copiaProductos
            };

            while (Oferta5.debeAplicar(resultadoOfertas.productosQueNoAplican)) {
              const resultadoAplicar = Oferta5.aplicar(resultadoOfertas.productosQueNoAplican);
              resultadoOfertas.productosQueAplican = resultadoOfertas.productosQueAplican.concat(resultadoAplicar.productosQueAplican);
              resultadoOfertas.productosQueNoAplican = resultadoAplicar.productosQueNoAplican;
            }

            let totalVentasx = 0;
            let productosVendidosx = [];

            resultadoOfertas.productosQueAplican.forEach((prod) => {
              totalVentasx += prod.total;
              productosVendidosx.push(prod);
            });

            resultadoOfertas.productosQueNoAplican.forEach((prod) => {
              totalVentasx += prod.total;
              productosVendidosx.push(prod);
            });

            // console.log("total de las ventas aplicando ofertas es $", totalVentasx);
            setTotalVentas(totalVentasx);
            setProductosVendidos(productosVendidosx);
          }
        });
      } else {
        // console.log("no hay ofertas")
        setProductosVendidos(salesData);
        setTotalVentas(grandTotal);
      }
    }, (err) => {
      // console.log("error de ofertas", err)
      setProductosVendidos(salesData);
      setTotalVentas(grandTotal);
    });

    await Model.getServerConfigs((serverConfigs) => {
      serverConfigs.forEach((serverConfig) => {
        if (
          serverConfig.grupo === "Ticket" &&
          serverConfig.entrada === "ImprimirComanda" &&
          serverConfig.valor === "SI"
        ) {
          setTrabajaConComanda(true);
        }
      });
    }, () => { });
  };

  useEffect(() => {
    aplicarOfertas();
  }, []);

  // Función para procesar el pago
  const handlePagoBoleta = async () => {
    // console.log("totalPagos", totalPagos);
    // console.log("totalYDescuentoYRedondeo", totalYDescuentoYRedondeo);
    // console.log("redondeo", redondeo);

    if (totalPagos === 0 && grandTotal === 0) {
      showAlert("No se puede hacer una venta con valor 0");
      return;
    }

    const pagaConEfectivo = System.pagaConEfectivo(pagos);
    console.log("pagaConEfectivo", pagaConEfectivo);

    if ((totalPagos < (totalYDescuentoYRedondeo + redondeo - 10) && pagaConEfectivo) ||
      (!pagaConEfectivo && totalPagos < totalYDescuentoYRedondeo)) {
      showAlert("Debe completar los pagos para continuar");
      return;
    }
    console.log("el pago esta completo")
    if (trabajaConComanda && nombreClienteComanda.length < 1) {
      showAlert("Debe completar el nombre de la comanda");
      return;
    }

    let algunaPreventa = "";
    const requestBody = {
      idUsuario: userData.codigoUsuario,
      fechaIngreso: System.getInstance().getDateForServer(new Date()),
      codigoCliente: 0,
      codigoUsuarioVenta: 0,
      subtotal: totalYDescuentoYRedondeo,
      totalPagado: totalPagos,
      totalRedondeado: totalFinal,
      vuelto: vuelto,
      redondeo: (aplicaRedondeo ? redondeo : 0),
      products: productosConEnvases.map((producto) => {
        const esEnvase = ProductSold.esEnvase(producto);
        if (esEnvase) {
          const owner = ProductSold.getOwnerByEnvase(producto, productosConEnvases);
          const difcant = owner.quantity - producto.quantity;
          return {
            codProducto: 0,
            codbarra: producto.idProducto + "",
            cantidad: System.getInstance().typeIntFloat(difcant),
            precioUnidad: producto.price,
            descripcion: producto.description,
          };
        } else {
          if (producto.preVenta) {
            if (algunaPreventa.length > 0) {
              if (algunaPreventa.indexOf(producto.preVenta) === -1) {
                algunaPreventa += "," + producto.preVenta;
              }
            } else {
              algunaPreventa = producto.preVenta;
            }
          }
          return {
            codProducto: 0,
            codbarra: producto.idProducto + "",
            cantidad: System.getInstance().typeIntFloat(producto.quantity),
            precioUnidad: producto.price,
            descripcion: producto.description,
          };
        }
      }),
      pagos: pagos,
      preVentaID: algunaPreventa,
      nombreClienteComanda: nombreClienteComanda,
      transferencias: {}

    };

    let transferenciaDatos = {};
    pagos.forEach((pago) => {
      if (pago.metodoPago === "TRANSFERENCIA") {
        transferenciaDatos = pago.transferencia;
      }
    });

    pagos.forEach((pago) => {
      if (pago.metodoPago === "CUENTACORRIENTE") {
        if (pago.data && pago.data.codigoUsuario) {
          requestBody.codigoUsuarioVenta = pago.data.codigoUsuario;
        } else if (pago.data && pago.data.codigoCliente) {
          requestBody.codigoCliente = cliente.codigoCliente;
        }
      }
    });


    requestBody.transferencias = transferenciaDatos;
    setError(null);

    LastSale.prepare(requestBody);
    let MPago = new PagoBoleta();
    MPago.fill(requestBody);

    setLoading(true);
    // showLoading("Realizando el pago")
    console.log("cancelando");
    setLoading(false);

    const esModoAvion = true // await PagoBoleta.analizarSiEsModoAvion(requestBody); // Esperar resolución

    showLoading("Haciendo el pago")
    await MPago.hacerPago(
      requestBody,
      esModoAvion,
      async (responsex) => {
        let response = { ...responsex };

        hideLoading();
        // showAlert(response.descripcion);
        showAlert("Realizado correctamente");
        clearSalesData();
        setVuelto(0);
        setSelectedUser(null);
        setTextSearchProducts("");
        setCliente(null);

        if (response.imprimirResponse === undefined) {
          response.imprimirResponse = {};
          response.imprimirResponse.test = "";
        }
        LastSale.confirm(response);

        const cantidad = await ModelConfig.get("cantidadTicketImprimir");
        const cantAImprimir = parseInt(cantidad);
        Printer.printAll(response, cantAImprimir);



        // const cantAImprimir = parseInt(ModelConfig.get("cantidadTicketImprimir"));
        // Printer.printAll(response, cantAImprimir);

        setUltimoVuelto(vuelto);
        setTimeout(() => {
          onClose();
          UserEvent.send({
            name: "realiza venta",
            info: JSON.stringify(requestBody)
          });
          // setLoading(false);
        }, 500);


      },
      (error, response) => {
        hideLoading();
        Alert.alert(error);
        // setLoading(false);
        // if (response && response.status === 409) {
        //   Alert.alert("Intento de pago", error);
        // }
      }
    );
  };

  return (

    <ScrollView contentContainerStyle={styles.container}>
      {/* Modal o diálogo para ingresar el nombre de la comanda */}
      {/* <IngresarTexto
        title="Ingresar Nombre para comanda"
        openDialog={showNombreComanda}
        setOpenDialog={setShowNombreComanda}
        varChanger={setNombreClienteComanda}
        varValue={nombreClienteComanda}
      /> */}

      <View style={styles.row}>
        {/* Sección principal */}
        <View style={styles.mainSection}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Pagar con"
              keyboardType="numeric"
              value={pagarCon}
              onChangeText={(value) => {
                // console.log("cambio pagar con ", value)
                if (!value.trim()) {
                  setPagarCon(0);
                } else {
                  const numValue = parseFloat(value);
                  if (numValue > 0) {
                    setPagarCon(numValue);
                  }

                  // console.log("numValue", numValue)
                }
              }}
            />
          </View>

          <View style={styles.totalsContainer}>
            <Text style={styles.totalText}>
              Total: $ {parseFloat(totalFinal + "").toLocaleString()}
            </Text>
            <Text style={styles.subTotalText}>
              SubTotal: $ {parseFloat(totalYDescuentoYRedondeo + "").toLocaleString()}
            </Text>
            <Text style={styles.infoText}>
              Total pagos: $ {parseFloat(totalPagos + "").toLocaleString()}
            </Text>
            {faltaPagar > 0 && (
              <Text style={styles.errorText}>
                Falta pagar: $ {parseFloat(faltaPagar + "").toLocaleString()}
              </Text>
            )}
            {aplicaRedondeo && (
              <Text style={styles.infoText}>
                Redondeo: $ {parseFloat(redondeo + "").toLocaleString()}
              </Text>
            )}
            <Text style={styles.infoText}>
              Vuelto: $ {(vuelto + "")}
            </Text>
          </View>

          <BoxEntregaEnvases
            tieneEnvases={tieneEnvases}

            settieneEnvases={settieneEnvases}
            products={productosVendidos}
            productosConEnvases={productosConEnvases}
            setProductosConEnvases={setProductosConEnvases}
            descuentoEnvases={descuentoEnvases}
            setDescuentoEnvases={setDescuentoEnvases}
          />

          <BoxPagos
            pagos={pagos}
            setPagos={setPagos}
            totalPagos={totalPagos}
            setTotalPagos={setTotalPagos}
            onRemove={() => setCambioManualTeclado(false)}
          />

          <BoxMultiPago
            pagarCon={pagarCon}
            setPagarCon={setPagarCon}
            vuelto={vuelto}
            setVuelto={setVuelto}
            redondeo={redondeo}
            setRedondeo={setRedondeo}
            descuentos={descuentoEnvases}
            totalVentas={totalVentas}
            totalYDescuentoYRedondeo={totalYDescuentoYRedondeo}
            setTotalYDescuentoYRedondeo={setTotalYDescuentoYRedondeo}
            cambioManualTeclado={cambioManualTeclado}
            setCambioManualTeclado={setCambioManualTeclado}
            pagos={pagos}
            setPagos={setPagos}
            totalPagos={totalPagos}
            setTotalPagos={setTotalPagos}
            setAplicaRedondeo={setAplicaRedondeo}
            setFaltaPagar={setFaltaPagar}
            setTotalFinal={setTotalFinal}

            excluirMetodos={[
              "TRANSFERENCIA",
              "CUENTACORRIENTE"
            ]}
          />
        </View>

        {/* Sección lateral con el teclado para el pago */}
        {/* <View style={styles.sideSection}>
          <TecladoPagoCaja
          
          
            showFlag={true}
            varValue={pagarCon}
            varChanger={(v) => {
              setPagarCon(v);
              setCambioManualTeclado(true);
            }}
            onEnter={() => {}}
            esPrimeraTecla={!cambioManualTeclado}
          />
        </View> */}
      </View>

      {/* Pie de página con el botón final y datos de comanda */}
      <View style={styles.footer}>
        {trabajaConComanda && (
          <View style={styles.comandaContainer}>
            <Text style={styles.label}>Nombre de comanda</Text>
            <TextInput
              style={styles.comandaInput}
              value={nombreClienteComanda}
              onChangeText={setNombreClienteComanda}
              onFocus={() => setShowNombreComanda(true)}
            />
          </View>
        )}
        <TouchableOpacity style={styles.finalButton} onPress={handlePagoBoleta}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Finalizar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={{
            width: "100%",
            padding: 10,
            textAlign: "center",
            color: "black",
            backgroundColor: "#ccc",
            marginVertical: 5,
            fontWeight: "bold"
          }}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  mainSection: {
    flex: 2,
    paddingRight: 10,
  },
  sideSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#518eb9',
    borderRadius: 4,
    padding: 10,
    fontSize: 17,
  },
  totalsContainer: {
    marginBottom: 15,
  },
  totalText: {
    color: 'rgb(225, 33, 59)',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTotalText: {
    color: 'rgb(68,65,65)',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'rgb(225, 33, 59)',
    marginBottom: 5,
  },
  footer: {
    marginTop: 20,
  },
  comandaContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  comandaInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  finalButton: {
    backgroundColor: '#6c63ff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default BoxBoleta;
