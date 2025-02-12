
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig";
import axios from 'axios';
import ModelConfig from '../Models/ModelConfig';

import EndPoint from '../Models/EndPoint';


class Suspender extends Model{
    usuario: number
    descripcion: string
    ventaSuspenderDetalle: any
    // [
        // {
            // "cantidad": 0,
            // "codProducto": "string"
        // }
    // ]


  
  static instance: Suspender | null = null;

    static getInstance():Suspender{
        if(Suspender.instance == null){
            Suspender.instance = new Suspender();
        }

        return Suspender.instance;
    }
    
  async suspender(callbackOk, callbackWrong){
    if(
        !this.usuario
        || !this.descripcion
        || !this.ventaSuspenderDetalle
    ){
        console.log("faltan datos");
        return
    }

    const data = this.getFillables()
    data["ventaSuspenderDetalle"] = this.ventaSuspenderDetalle
    const configs = ModelConfig.get()
    var url = configs.urlBase + 
    "/api/Ventas/SuspenderVentaAdd"
    console.log(url)

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(responseData,response);
    },callbackWrong)
  }

  async listarVentas(userId,callbackOk, callbackWrong){
    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Ventas/SuspenderVentaGetByIdUsuario?idusuario=" + userId;
    url += "&codigoSucursal=" + ModelConfig.get("sucursal")
    url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
      
    EndPoint.sendGet(url,(responseData, response)=>{
      callbackOk(response.data.ventaSuspenderCabeceras,response)
    },callbackWrong)
  }

  async recuperar(id,callbackOk, callbackWrong){
    const data:any = {
      id: id
    }

    const configs = ModelConfig.get()
    var url = configs.urlBase
    +"/api/Ventas/SuspenderVentaDelete"

    if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
    if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

    EndPoint.sendPost(url,data,(responseData, response)=>{
      callbackOk(response,responseData);
    },callbackWrong)
  }
};

export default Suspender;