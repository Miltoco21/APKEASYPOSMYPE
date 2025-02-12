import StorageSesion from '../Helpers/StorageSesion.ts';
import IProduct from '../Types/IProduct.ts';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig.ts";
import IPagoBoleta, { IProductoPagoBoleta, ITransferencia } from '../Types/IPagoBoleta.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class PagoBoleta extends Model implements IPagoBoleta  {
    idUsuario: number;
    codigoClienteSucursal: number;
    codigoCliente: number;
    total: number;
    products: IProductoPagoBoleta[];
    metodoPago: string;
    transferencias: ITransferencia;

  async hacerPago(data, modo_avion,callbackOk, callbackWrong){
    console.log("modo avion?" + (modo_avion?"si":"no"))
    const configs = ModelConfig.get()
    var url = configs.urlBase

    if(modo_avion){
      // url += "/api/Ventas/RedelcomImprimirTicket"
      // url += "/api/Imprimir/Ticket"
      url += "/api/Imprimir/TicketNew"
    }else{
      url += "/api/Imprimir/Boleta"
    }

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.codigoClienteSucursal) data.codigoClienteSucursal = "0"
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

      
    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }
};

export default PagoBoleta;