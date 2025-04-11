import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import { SafeAreaView } from "react-native-safe-area-context";

const BoxPagos = ({ pagos, setPagos, totalPagos, setTotalPagos, onRemove = (pagoEliminado: any) => {} }) => {
  const { showConfirm } = useContext(SelectedOptionsContext);

  const esDataUsuario = (pago) => pago.data && pago.data.codigoUsuario !== undefined;
  const esDataCliente = (pago) => pago.data && pago.data.codigoCliente !== undefined;
  const esDataTarjetas = (pago) => pago.metodoPago === "TARJETA";
  const esDataTransferencia = (pago) => pago.metodoPago === "TRANSFERENCIA";

  const getDataUsuario = (pago) => (esDataUsuario(pago) ? `${pago.data.nombres} ${pago.data.apellidos}` : "");
  const getDataCliente = (pago) => (esDataCliente(pago) ? `${pago.data.nombreResponsable} ${pago.data.apellidoResponsable}` : "");
  const getDataTarjetas = (pago) => (esDataTarjetas(pago) ? pago.tipoTarjeta : "");
  const getDataTransferencia = (pago) => (esDataTransferencia(pago) ? pago.transferencia.nombre || "N/D" : "");

  // const confirmarEliminarPago = (ix) => {
  //   const [pagoEliminado] = pagos.splice(ix, 1);

  //   //const pagoEliminado = pagos.splice(ix, 1);
  //   setPagos([...pagos]);
  //   const total = pagos.reduce((sum, pago) => sum + pago.montoMetodoPago, 0);
  //   setTotalPagos(total);
  //   onRemove(pagoEliminado);
  // };
  const confirmarEliminarPago = (ix) => {
    const [pagoEliminado] = pagos.splice(ix, 1);
    setPagos([...pagos]); 

    let total = pagos.reduce((acc, pago) => acc + pago.montoMetodoPago, 0);
    setTotalPagos(total);

    onRemove(pagoEliminado);
};


  const eliminarPago = (pago, ix) => {
    if (pago.metodoPago === "TRANSFERENCIA") {
      Alert.alert("Confirmación", "¿Eliminar el pago con transferencia?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => confirmarEliminarPago(ix) },
      ]);
    } else {
      confirmarEliminarPago(ix);
    }
  };

  const checkMontoEfectivo = (pago) => {
    if (pago.metodoPago !== "EFECTIVO") return pago.montoMetodoPago;
    const redondeo = Product.logicaRedondeoUltimoDigito(pago.montoMetodoPago);
    return redondeo !== 0 ? pago.montoMetodoPago + redondeo : pago.montoMetodoPago;
  };

  return (
    <SafeAreaView style={styles.container}>
      {totalPagos > 0 && (
        <View>
          <Text style={styles.title}>Pagos</Text>
          <FlatList
            data={pagos}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <Text style={styles.text}>${checkMontoEfectivo(item)}</Text>
                <Text style={styles.text}>{item.metodoPago}</Text>
                <Text style={styles.text}>
                  {getDataUsuario(item) + getDataCliente(item) + getDataTarjetas(item) + getDataTransferencia(item)}
                </Text>
                <TouchableOpacity onPress={() => eliminarPago(item, index)}>
                  <IconButton icon="delete"  size={20} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    padding: 2,
   
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  text: {
    fontSize: 12,
    flex: 1,
  },
});

export default BoxPagos;
