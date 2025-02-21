import StorageSesion from '../Helpers/StorageSesion.js';
import IProduct from '../Types/IProduct.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import axios from 'axios';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';


class TicketPreventa extends Model {
  async hacerTicket(data,callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Ventas/PreVentaAdd"

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }
};

export default TicketPreventa;