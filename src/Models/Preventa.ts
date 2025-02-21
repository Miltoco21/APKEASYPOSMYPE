import StorageSesion from '../Helpers/StorageSesion.js';
import IProduct from '../Types/IProduct.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import axios from 'axios';
import ModelConfig from './ModelConfig.js';
import ProductSold from './ProductSold.js';
import Sales from './Sales.js';
import System from '../Helpers/System.js';
import EndPoint from './EndPoint.js';


class Preventa extends Model {
    static instance: Preventa | null = null;
    static getInstance():Preventa{
        if(Preventa.instance == null){
            Preventa.instance = new Preventa();
        }

        return Preventa.instance;
    }

    static adaptarLecturaProductos(productosDePreventa):ProductSold[]{
        // console.log("adaptarLecturaProductos..")
        // console.log("antes..", System.clone(productosDePreventa))
        var prods:any = []

        productosDePreventa.forEach((prodPreVenta,ix)=>{
            if(prodPreVenta.descripcion === "Envase"){
                prods[prods.length -1 ].envase = []
                prods[prods.length -1 ].envase.push({
                    ...prodPreVenta,
                    costo: prodPreVenta.precioUnidad
                })
            }else{
                prods.push(prodPreVenta)
            }
        })

        // console.log("despues..", System.clone(prods))
        return prods
    }

    static yaFueUsada(hashPreventa, listaProductos){
        var ya = false
        listaProductos.forEach((prod)=>{
            if(prod.preVenta && prod.preVenta.indexOf(hashPreventa)>-1){
                ya = true
            }
        })

        return ya
    }


    static buscarPorFolio(data, callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        url += "/api/Ventas/PreVentaGET"
        
        if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url,data,(responseData, response)=>{
            if(responseData.preventa.length > 0){
                callbackOk(responseData.preventa[0].products, responseData);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
            
        },(err)=>{
            
            callbackWrong(err)
        })
    }

};



export default Preventa;