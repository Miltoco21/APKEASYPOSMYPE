// import StorageSesion from '../Helpers/StorageSesion.js';
// import BaseConfig from "../definitions/BaseConfig.js";
// import MovimientoCaja from "../Types/MovimientoCaja.js";
// import axios from "axios";
// import Model from './Model.js';
// import ModelConfig from "../Models/ModelConfig"
// import EndPoint from '../Models/EndPoint';


// class AperturaCaja extends Model implements MovimientoCaja{
//     motivo: string | null | undefined;
//     rutProveedor: string | null | undefined;
//     idUsuario: string | null | undefined;
//     codigoUsuario: number;
//     codigoSucursal: number;
//     puntoVenta: string;
//     fechaIngreso: string;
//     tipo: string;
//     detalleTipo: string;
//     observacion: string;
//     monto: number;
//     idTurno: number;

//     static instance: AperturaCaja | null = null;

//     static getInstance():AperturaCaja{
//         if(AperturaCaja.instance == null){
//             AperturaCaja.instance = new AperturaCaja();
//         }

//         return AperturaCaja.instance;
//     }

//     saveInSesion(data){
//         this.sesion.guardar(data)
//         // localStorage.setItem('userData', JSON.stringify(data));
//         return data;
//     }

//     getFromSesion(){
//         return this.sesion.cargar(1)
//         // var dt = localStorage.getItem('userData') || "{}";
//         // return JSON.parse(dt);
//     }

//     async sendToServer(callbackOk, callbackWrong){
//         var data = this.getFillables();
//         const configs = await ModelConfig.get()
//         var url = configs.urlBase
//         +"/api/Cajas/AddCajaFlujo"

//         if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
//         if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")

//         EndPoint.sendPost(url,data,(responseData, response)=>{
//             callbackOk(responseData,response);
//         },callbackWrong)
            
//     }
    

// };

// export default AperturaCaja;

import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseConfig from "../definitions/BaseConfig.js";
import MovimientoCaja from "../Types/MovimientoCaja.js";
import axios from "axios";
import Model from './Model.js';
import ModelConfig from "../Models/ModelConfig";
import EndPoint from '../Models/EndPoint';

class AperturaCaja extends Model implements MovimientoCaja {
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

    static getInstance(): AperturaCaja {
        if (AperturaCaja.instance == null) {
            AperturaCaja.instance = new AperturaCaja();
        }
        return AperturaCaja.instance;
    }

    async saveInSesion(data: any) {
        try {
            await AsyncStorage.setItem('userData', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Error guardando en AsyncStorage:", error);
        }
    }

    async getFromSesion() {
        try {
            const data = await AsyncStorage.getItem('userData');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error("Error cargando desde AsyncStorage:", error);
            return {};
        }
    }

    // async sendToServer(callbackOk: Function, callbackWrong: Function) {
    //     var data = this.getFillables();
        
    //     console.log("Datos a enviar:", JSON.stringify(data, null, 2)); // Log para depuración
        
    //     try {
    //         const configs = await ModelConfig.get();
    //         var url = configs.urlBase + "/api/Cajas/AddCajaFlujo";

    //         if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal");
    //         if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta");

    //         console.log("URL de la petición:", url);

    //         EndPoint.sendPost(url, data, (responseData, response) => {
    //             callbackOk(responseData, response);
    //         }, (error) => {
    //             console.error("Error en la petición:", error.response?.data || error.message);
    //             callbackWrong(error);
    //         });

    //     } catch (error) {
    //         console.error("Error en sendToServer:", error);
    //         callbackWrong(error);
    //     }
    // }
    async sendToServer(callbackOk: Function, callbackWrong: Function) {
        try {
            const configs = await ModelConfig.get();
            const url = configs.urlBase + "/api/Cajas/AddCajaFlujo";
    
            var data = this.getFillables();
    
            if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal");
            if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta");
    
            // console.log("Payload final a enviar:", JSON.stringify(data, null, 2));
    
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            // console.log("Respuesta del servidor:", response.data);
            callbackOk(response.data);
        } catch (error) {
            console.error("Error en sendToServer:", error.response?.data || error.message);
            callbackWrong(error);
        }
    }
    
}

export default AperturaCaja;
