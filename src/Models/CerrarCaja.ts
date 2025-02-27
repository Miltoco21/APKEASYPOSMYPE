import StorageSesion from '../Helpers/StorageSesion'
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig";

import axios from 'axios';
import ModelConfig from './ModelConfig';
import SoporteTicket from './SoporteTicket';
import EndPoint from './EndPoint';

class CerrarCaja extends Model {
  async enviar(data,callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
      + "/api/Cajas/AddCajaArqueo";

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
        
  }
};

export default CerrarCaja;