import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import Colors from "../Colores/Colores";

// Importar el contexto y helpers/modelos personalizados
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import PagoBoleta from "../../Models/PagoBoleta";
import TecladoPagoCaja from "../Teclados/TecladoPagoCaja"; ///// reemplaza tevlano cuano no tinene
import BoxEntregaEnvases from "./BoxEntregaEnvases";
import BoxPagos from "./BoxPagos";
import BoxMultiPago from "./BoxMultiPago";
//import IngresarTexto from '../ScreenDialog/IngresarTexto'; debe quedar vacion reemplza teclado
import LastSale from '../../Models/LastSale';
import ModelConfig from '../../Models/ModelConfig';
import UserEvent from '../../Models/UserEvent';
import Model from '../../Models/Model';
import Oferta5 from '../../Models/Oferta5';
import ProductSold from '../../Models/ProductSold';
import { Button } from 'react-native-paper';
import Log from 'src/Models/Log';
import TecladoBilletes from './TecladoBilletes';
import PrinterBluetooth from 'src/Models/PrinterBluetooth';

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
    setUltimoVuelto,
    showConfirm,
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
  const [showBilletesModal, setShowBilletesModal] = useState(false);
  // Función para aplicar ofertas
  const aplicarOfertas = async () => {
    // console.log("aplicando ofertas");
    // Log("salesData", salesData)

    await Model.getOfertas(
      (ofertas) => {
        if (ofertas.length > 0) {
          ofertas.forEach((ofer) => {
            if (ofer.tipo === 5) {
              let copiaProductos = salesData;
              Oferta5.setInfo(ofer);
              let resultadoOfertas = {
                productosQueAplican: [],
                productosQueNoAplican: copiaProductos,
              };

              while (
                Oferta5.debeAplicar(resultadoOfertas.productosQueNoAplican)
              ) {
                const resultadoAplicar = Oferta5.aplicar(
                  resultadoOfertas.productosQueNoAplican
                );
                resultadoOfertas.productosQueAplican =
                  resultadoOfertas.productosQueAplican.concat(
                    resultadoAplicar.productosQueAplican
                  );
                resultadoOfertas.productosQueNoAplican =
                  resultadoAplicar.productosQueNoAplican;
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
      },
      (err) => {
        // console.log("error de ofertas", err)
        setProductosVendidos(salesData);
        setTotalVentas(grandTotal);
      }
    );

    await Model.getServerConfigs(
      (serverConfigs) => {
        serverConfigs.forEach((serverConfig) => {
          if (
            serverConfig.grupo === "Ticket" &&
            serverConfig.entrada === "ImprimirComanda" &&
            serverConfig.valor === "SI"
          ) {
            setTrabajaConComanda(true);
          }
        });
      },
      () => { }
    );
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

    if (
      (totalPagos < totalYDescuentoYRedondeo + redondeo - 10 &&
        pagaConEfectivo) ||
      (!pagaConEfectivo && totalPagos < totalYDescuentoYRedondeo)
    ) {
      showAlert("Debe completar los pagos para continuar");
      return;
    }
    console.log("el pago esta completo");
    // if (trabajaConComanda && nombreClienteComanda.length < 1) {
    //   showAlert("Debe completar el nombre de la comanda");
    //   return;
    // }

    let algunaPreventa = "";
    const requestBody = {
      operacion: "detalleVenta",
      idUsuario: userData.codigoUsuario,
      fechaIngreso: System.getInstance().getDateForServer(new Date()),
      codigoCliente: 0,
      codigoUsuarioVenta: 0,
      subtotal: totalYDescuentoYRedondeo,
      totalPagado: totalPagos,
      total: totalPagos,
      totalRedondeado: totalFinal,
      vuelto: vuelto,
      descuento: 0,
      redondeo: (aplicaRedondeo ? redondeo : 0),
      products: productosConEnvases.map((producto) => {
        const esEnvase = ProductSold.esEnvase(producto);
        if (esEnvase) {
          const owner = ProductSold.getOwnerByEnvase(
            producto,
            productosConEnvases
          );
          const difcant = owner.quantity - producto.quantity;
          return {
            codProducto: 0,
            codbarra: producto.idProducto + "",
            cantidad: System.getInstance().typeIntFloat(difcant),
            precioUnidad: producto.price,
            descripcion: producto.description,
            extras: {
              agregar: [],
              quitar: [],
              entrega: "SERVIR"
            }
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
            extras: {
              agregar: [],
              quitar: [],
              entrega: "SERVIR"
            }
          };
        }
      }),
      pagos: pagos,
      preVentaID: algunaPreventa,
      nombreClienteComanda: "prueba",//nombreClienteComanda,
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

    const esModoAvion = true; // await PagoBoleta.analizarSiEsModoAvion(requestBody); // Esperar resolución

    showLoading("Haciendo el pago");
    await MPago.hacerPago(
      requestBody,
      esModoAvion,
      async (responsex) => {
        let response = { ...responsex };
      
        hideLoading();
        onClose();
        // showAlert(response.descripcion);
       
        //onClose();
      

        clearSalesData();
        setVuelto(0);
        setSelectedUser(null);
        setTextSearchProducts("");
         showAlert("Pago Realizado correctamente");
        setCliente(null);

        if (response.imprimirResponse === undefined) {
          response.imprimirResponse = {};
          response.imprimirResponse.test = "";
        }
        LastSale.confirm(response);

        const cantidad = await ModelConfig.get("cantidadTicketImprimir");
        const cantAImprimir = parseInt(cantidad);
        // PrinterBluetooth.printAll(requestBody,response, cantAImprimir);
        PrinterBluetooth.prepareBluetooth(() => {
          PrinterBluetooth.printAll(requestBody, response);
        })

        // const cantAImprimir = parseInt(ModelConfig.get("cantidadTicketImprimir"));
        // Printer.printAll(response, cantAImprimir);

        setUltimoVuelto(vuelto);
        setTimeout(() => {
          onClose();
          UserEvent.send({
            name: "realiza venta",
            info: JSON.stringify(requestBody),
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
    <View contentContainerStyle={styles.container}>
      {/* <TecladoBilletes
  visible={showBilletesModal}
  onClose={() => setShowBilletesModal(false)}
  onAmountSelected={(monto) => {
    setPagarCon(monto);
    setCambioManualTeclado(true);
  }}
/> */}
      <TecladoBilletes
        visible={showBilletesModal}
        onClose={() => setShowBilletesModal(false)}
        initialValue={pagarCon}

        // <--- PASAMOS EL VALOR ACTUAL
        onAmountSelected={(monto) => {
          setPagarCon(monto);
          setCambioManualTeclado(true);
        }}
      />

      <View style={styles.row}>
        <View style={styles.mainSection}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Pagar con"
              keyboardType="numeric"
              value={pagarCon.toString()}
              onChangeText={(value) => {
                const numValue = parseFloat(value) || 0;
                setPagarCon(numValue > 0 ? numValue : 0);
              }}
            />
          </View>

          <View style={styles.totalsRow}>
            <View style={styles.totalsTextContainer}>
              <Text style={styles.totalText}>
                Total: $ {totalFinal.toLocaleString()}
              </Text>
              <Text style={styles.subTotalText}>
                SubTotal: $ {totalYDescuentoYRedondeo.toLocaleString()}
              </Text>
              <Text style={styles.infoText}>
                Total pagos: $ {totalPagos.toLocaleString()}
              </Text>
              {faltaPagar > 0 && (
                <Text style={styles.errorText}>
                  Falta pagar: $ {faltaPagar.toLocaleString()}
                </Text>
              )}
              {aplicaRedondeo && (
                <Text style={styles.infoText}>
                  Redondeo: $ {redondeo.toLocaleString()}
                </Text>
              )}
              <Text style={styles.infoText}>
                Vuelto: $ {vuelto.toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.pesoButton}
              onPress={() => setShowBilletesModal(true)}
            >
              <Text style={styles.pesoButtonText}>$</Text>
            </TouchableOpacity>
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
            //excluirMetodos={["TRANSFERENCIA", "CUENTACORRIENTE"]}
             excluirMetodos={[ "CUENTACORRIENTE"]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.finalButton}
          onPress={handlePagoBoleta}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Finalizar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.finalButtonBack} onPress={onClose}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  mainSection: {
    flex: 1,
  },
  inputRow: {
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#518eb9",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    height: 50,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 15,
    gap: 10,
  },
  totalsTextContainer: {
    flex: 1,
  },
  totalText: {
    color: "#e1213b",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subTotalText: {
    color: "#444141",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  errorText: {
    fontSize: 16,
    color: "#e1213b",
    fontWeight: "500",
    marginVertical: 5,
  },
  pesoButton: {
    backgroundColor: "#6c63ff",
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  pesoButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlignVertical: "center",
  },
  footer: {
    marginTop: 20,
    marginBottom: 10,
  },
  finalButton: {
    backgroundColor: Colors.azul,
    padding: 16,
    marginBottom: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  finalButtonBack: {
    backgroundColor: Colors.rojo,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default BoxBoleta;
