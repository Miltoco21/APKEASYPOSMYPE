import StorageSesion from '../Helpers/StorageSesion'
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig";

import axios from 'axios';
import ModelConfig from './ModelConfig';
import SoporteTicket from './SoporteTicket';
import EndPoint from './EndPoint';
import Log from './Log';

class CerrarCaja extends Model {
  async enviar(data, callbackOk, callbackWrong) {
    const configs = await ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaArqueo";

    if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal")
    if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta")
    if (!data.idEmpresa) data.idEmpresa = await ModelConfig.get("idEmpresa")

      EndPoint.sendPost(url, data, (responseData, response) => {
      callbackOk(responseData, response);
    }, callbackWrong)

  }
};

export default CerrarCaja;