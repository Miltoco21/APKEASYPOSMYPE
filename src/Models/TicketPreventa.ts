import StorageSesion from '../Helpers/StorageSesion.js';
import IProduct from '../Types/IProduct.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import axios from 'axios';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';


class TicketPreventa extends Model {
  async hacerTicket(data, callbackOk, callbackWrong) {
    const configs = await ModelConfig.get()
    var url = configs.urlBase
      + "/api/Ventas/PreVentaAdd"

    if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta")
    if (!data.idEmpresa) data.idEmpresa = await ModelConfig.get("idEmpresa")

    await EndPoint.sendPost(url, data, (responseData, response) => {
      callbackOk(responseData, response);
    }, callbackWrong)
  }
};

export default TicketPreventa;