import StorageSesion from '../Helpers/StorageSesion.js';
import IProduct from '../Types/IProduct.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.js';
import axios from 'axios';
import ModelConfig from '../Models/ModelConfig'
import EndPoint from '../Models/EndPoint';


class InfoCierre extends Model {
  info: any;


  async obtenerDeServidor(idUsuario, callbackOk, callbackWrong) {
    const configs = await ModelConfig.get()
    var url = configs.urlBase + "/api/Cajas/GetArqueoCajaByIdUsuario?idusuario=" + idUsuario

    url += "&codigoSucursal=" + await ModelConfig.get("sucursal")
    url += "&puntoVenta=" + await ModelConfig.get("puntoVenta")
    url += "&idEmpresa=" + await ModelConfig.get("idEmpresa")

    EndPoint.sendGet(url, (responseData, response) => {
      callbackOk(responseData, response);
      this.info = response.data;
    }, callbackWrong)
  }
};

export default InfoCierre;