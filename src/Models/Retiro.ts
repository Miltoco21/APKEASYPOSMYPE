import StorageSesion from '../Helpers/StorageSesion.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.js';
import axios from 'axios';
import MovimientoCaja from '../Types/MovimientoCaja.js';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';


class Retiro extends Model implements MovimientoCaja {
  codigoUsuario: number;
  codigoSucursal: number;
  puntoVenta: string;
  fechaIngreso: string;
  idTurno: number;
  tipo: string;
  detalleTipo: string;
  observacion: string;
  monto: number;

  motivo: string | null | undefined;
  rutProveedor: string | null | undefined;
  idUsuario: string | null | undefined;

  static TIPO = "EGRESO"



  async retiroDeCaja(callbackOk, callbackWrong) {
    if (!this.motivo) {
      console.log("Retiro. retiroDeCaja. Falta motivo");
      callbackWrong("Falta motivo");
      return
    }
    this.tipo = Retiro.TIPO
    this.detalleTipo = "RETIRODECAJA"
    this.observacion = this.motivo

    const data = this.getFillables()
    delete data.motivo


    const configs = await ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaFlujo"

    if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta")
    if (!data.idEmpresa) data.idEmpresa = await ModelConfig.get("idEmpresa")

    EndPoint.sendPost(url, data, (responseData, response) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }


  async anticipoTrabajador(callbackOk, callbackWrong) {
    if (this.codigoUsuario == null) {
      console.log("Retiro. pago de factura. Falta codigoUsuario");
      return
    }
    this.tipo = Retiro.TIPO
    this.detalleTipo = "ANTICIPOTRABAJADOR"

    const data = this.getFillables()
    const configs = await ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaFlujo"

    if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta")
    if (!data.idEmpresa) data.idEmpresa = await ModelConfig.get("idEmpresa")

    EndPoint.sendPost(url, data, (responseData, response) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }
};

export default Retiro;