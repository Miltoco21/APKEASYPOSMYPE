import StorageSesion from '../Helpers/StorageSesion';
import IProduct from '../Types/IProduct';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta';
import axios from 'axios';
import ModelConfig from './ModelConfig';
import EndPoint from './EndPoint';
import MetodosPago from '../definitions/MetodosPago';
import System from '../Helpers/System';
import Log from './Log';


class PagoBoleta extends Model implements IPagoBoleta {
  idUsuario: number;
  codigoClienteSucursal: number;
  codigoCliente: number;
  total: number;
  products: IProductoPagoBoleta[];
  metodoPago: string;
  transferencias: ITransferencia;

  //devuelve lo opuesto a modo avion..
  static async analizarSiHaceBoleta(infoAEnviar) {
    const emitirBoleta = await (ModelConfig.get("emitirBoleta"))
    const tienePasarelaPago = await (ModelConfig.get("tienePasarelaPago"))
    const excluirMediosEnBoleta = await (ModelConfig.get("excluirMediosEnBoleta"))

    if (!emitirBoleta) {
      return false
    }

    if (!tienePasarelaPago) {
      return true
    }

    const metodosArr: any = System.arrayFromObject(MetodosPago, true)

    var algunExcluido = false
    infoAEnviar.pagos.forEach((pago) => {

      var metodoAdaptado = pago.metodoPago
      if (pago.metodoPago == "TARJETA") {
        metodoAdaptado = pago.tipoTarjeta
      }

      if (pago.metodoPago == "CUENTACORRIENTE") {
        metodoAdaptado = "CUENTA_CORRIENTE"
      }

      var index = metodosArr.indexOf(metodoAdaptado)
      if (index != -1 && excluirMediosEnBoleta.includes(index)) {
        algunExcluido = true
      }
    })

    return !algunExcluido
  }

  static analizarSiEsModoAvion(infoAEnviar) {
    return !this.analizarSiHaceBoleta(infoAEnviar)
  }

  async hacerPago(data, modo_avion, callbackOk, callbackWrong) {
    // console.log("modo avion?" + (modo_avion ? "si" : "no"))
    // const configs = ModelConfig.get()
    // var url = configs.urlBase

    var url = await ModelConfig.get("urlBase");
    if (modo_avion) {
      // url += "/api/Ventas/RedelcomImprimirTicket"
      // url += "/api/Imprimir/Ticket"
      url += "/api/Imprimir/TicketNew"
    } else {
      url += "/api/Imprimir/Boleta"
    }

    if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal")
    if (!data.codigoClienteSucursal) data.codigoClienteSucursal = "0"
    if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta")

    // Log("url", url)
    // Log("datos a enviar", data)
    await EndPoint.sendPost(url, data, (responseData, response) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }
};

export default PagoBoleta;