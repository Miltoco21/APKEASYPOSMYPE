import StorageSesion from '../Helpers/StorageSesion.js';
import IProduct from '../Types/IProduct.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.js';
import axios from 'axios';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';


class PagoFactura extends Model implements IPagoBoleta  {
    idUsuario: number;
    codigoClienteSucursal: number;
    codigoCliente: number;
    total: number;
    products: IProductoPagoBoleta[];
    metodoPago: string;
    transferencias: ITransferencia;

  async hacerPagoFactura(data,callbackOk, callbackWrong){
    const modo_avion = false//modo avion es para no figurar en afip

    
    const configs = ModelConfig.get()
    var url = configs.urlBase

    if(modo_avion){
      url += "/api/Ventas/RedelcomImprimirTicket"
    }else{
      url += "/api/GestionDTE/GenerarFacturaDTE"
    }

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }
};

export default PagoFactura;