import React, { useContext, useState, useEffect } from 'react';
import { 
  ScrollView,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { SelectedOptionsContext } from '../Context/SelectedOptionsProvider';

const BoxCierreCajaPaso2 = ({ 
  arrayBilletes,
  infoCierre,
  totalEfectivo,
  hasFocus
}) => {
  const { userData } = useContext(SelectedOptionsContext);
  const [diferenciaPositiva, setDiferenciaPositiva] = useState(false);
  const [diferencia, setDiferencia] = useState(0);

  useEffect(() => {
    if (!hasFocus) return;
    calcularDiferencia();
  }, [hasFocus]);

  const calcularDiferencia = () => {
    const dif = totalEfectivo - infoCierre.arqueoCajaById.totalSistema;
    setDiferencia(dif);
    setDiferenciaPositiva(dif >= 0);
    return dif;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.table}>
        {/* Encabezado */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader, styles.cellLeft, { flex: 2, textAlign: 'right' }]}>
            Cantidad de Billetes
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader, styles.cellRight, { flex: 1, textAlign: 'right' }]}>
            Total
          </Text>
        </View>

        {/* Detalle de billetes */}
        {arrayBilletes.map((billete, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.cellLeft, { flex: 2, textAlign: 'right' }]}>
              {billete.quantity} x ${billete.denomination}
            </Text>
            <Text style={[styles.tableCell, styles.cellRight, { flex: 1, textAlign: 'right' }]}>
              ${billete.subtotal}
            </Text>
          </View>
        ))}

        <View style={styles.spacer} />

        {/* Totales */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.cellLeftSepared, { flex: 2, textAlign: 'right' }]}>
            Total en caja
          </Text>
          <Text style={[styles.tableCell, styles.cellRightSepared, { flex: 1, textAlign: 'right' }]}>
            ${totalEfectivo}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, textAlign: 'right' }]}>
            Total sistema
          </Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
            ${infoCierre.arqueoCajaById.totalSistema}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, textAlign: 'right' }]}>
            {diferencia === 0
              ? 'No hay diferencia'
              : diferenciaPositiva
              ? 'Diferencia efectivo (sobrante)'
              : 'Diferencia efectivo (faltante)'}
          </Text>
          <Text
            style={[
              styles.tableCell,
              { flex: 1, textAlign: 'right', color: diferencia === 0 ? '#000' : (diferenciaPositiva ? 'green' : 'red') }
            ]}
          >
            ${Math.abs(diferencia)}
          </Text>
        </View>

        <View style={styles.spacer} />

        {/* Información del usuario */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.cellLeftSepared, { flex: 2, textAlign: 'right' }]}>
            Usuario
          </Text>
          <Text style={[styles.tableCell, styles.cellRightSepared, { flex: 1, textAlign: 'right' }]}>
            {userData.nombres + ' ' + userData.apellidos}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  table: {
    borderWidth: 3,
    borderColor: '#90b2f2',
    width: '100%',
    alignSelf: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#90b2f2',
  },
  tableCell: {
    padding: 5,
    fontSize: 20,
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  cellLeft: {
    borderRightWidth: 1,
    borderColor: '#90b2f2',
  },
  cellRight: {
    // No se necesita borde derecho en este caso
  },
  cellLeftSepared: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#90b2f2',
  },
  cellRightSepared: {
    borderTopWidth: 1,
    borderColor: '#90b2f2',
  },
  spacer: {
    height: 50,
  },
});

export default BoxCierreCajaPaso2;
