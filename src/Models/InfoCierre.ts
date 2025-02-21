import StorageSesion from '../Helpers/StorageSesion.js';
import IProduct from '../Types/IProduct.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.js';
import axios from 'axios';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';


class InfoCierre extends Model {
    info: any;


  async obtenerDeServidor(idUsuario,callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase + "/api/Cajas/GetArqueoCajaByIdUsuario?idusuario=" + idUsuario

    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(responseData,response);
      this.info = response.data;
    },callbackWrong)
  }
};

export default InfoCierre;