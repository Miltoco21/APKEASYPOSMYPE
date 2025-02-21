import StorageSesion from '../Helpers/StorageSesion.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.js';
import axios from 'axios';
import MovimientoCaja from '../Types/MovimientoCaja.js';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';


class Ingreso extends Model implements MovimientoCaja{
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
  
  static TIPO = "INGRESO"

  async otros(callbackOk, callbackWrong){
    if(!this.motivo){
      console.log("Ingreso. Otros ingresos. Falta motivo");
      return
    }
    this.tipo = Ingreso.TIPO
    this.detalleTipo = "OTROSINGRESOS"
    this.observacion = this.motivo

    const data = this.getFillables()
    delete data.motivo

    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Cajas/AddCajaFlujo"
    
    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }

};

export default Ingreso;