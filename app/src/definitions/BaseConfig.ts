const apiUrl = process.env.EXPO_PUBLIC_URL_BASE;
export const AfterLoginTypes = {
  PuntoVenta: 1,
  PreVenta: 2,
};

console.log("apiurl",apiUrl);


export const OrdenListado = {
  Ascendente: 1,
  Descendente: 2,
};

const BaseConfig = {
  urlBase: apiUrl,
  sesionExprire: 2 * 60 * 1000, //en milisegundos

  codBalanza: "250", //
  largoIdProdBalanza: 4, //
  largoPesoBalanza: 5, //
  digitosPesoEnterosBalanza: 1, //

  codBalanzaVentaUnidad: "270", //
  largoIdProdBalanzaVentaUnidad: 4, //
  largoPesoBalanzaVentaUnidad: 5, //

  cantidadProductosBusquedaRapida: 20,

  //showPrintButton: false,
  delayBetwenPrints: "1", //in seconds
  sucursal: "1",
  sucursalNombre: "",
  puntoVenta: "1",
  puntoVentaNombre: "",
  afterLogin: AfterLoginTypes.PuntoVenta,

  delayCloseWindowPrints: "0.3", //in seconds
  widthPrint: "80px",
  buttonDelayClick: 1500, //en milisegundos

  //suspenderYRecuperar: true,
  pedirDatosTransferencia: true,
  pagarConCuentaCorriente: true,

  pedirPermisoBorrarProducto: false,
  permitirVentaPrecio0: false,
  cantidadTicketImprimir: 1,

  ordenMostrarListado: OrdenListado.Descendente,

  verBotonPreventa: true,
  verBotonEnvases: true,
  verBotonPagarFactura: true,
};

export default BaseConfig;
