import StorageSesion from '../Helpers/StorageSesion.js';
import BaseConfig from "../definitions/BaseConfig.js";
import MovimientoCaja from "../Types/MovimientoCaja.js";
import axios from "axios";
import Model from './Model.js';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';


class AperturaCaja extends Model implements MovimientoCaja{
    motivo: string | null | undefined;
    rutProveedor: string | null | undefined;
    idUsuario: string | null | undefined;
    codigoUsuario: number;
    codigoSucursal: number;
    puntoVenta: string;
    fechaIngreso: string;
    tipo: string;
    detalleTipo: string;
    observacion: string;
    monto: number;
    idTurno: number;

    static instance: AperturaCaja | null = null;

    static getInstance():AperturaCaja{
        if(AperturaCaja.instance == null){
            AperturaCaja.instance = new AperturaCaja();
        }

        return AperturaCaja.instance;
    }

    saveInSesion(data){
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion(){
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    async sendToServer(callbackOk, callbackWrong){
        var data = this.getFillables();
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/Cajas/AddCajaFlujo"

        if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

        EndPoint.sendPost(url,data,(responseData, response)=>{
            callbackOk(responseData,response);
        },callbackWrong)
            
    }
    

};

export default AperturaCaja;