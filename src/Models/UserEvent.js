import StorageSesion from '../Helpers/StorageSesion';
import axios from "axios";
import ModelConfig from './ModelConfig';
import SoporteTicket from './SoporteTicket';
import EndPoint from './EndPoint';
import Singleton from './Singleton';
import User from './User';



export default class UserEvent extends Singleton {
    constructor() {
        this.sesion = new StorageSesion("UserEvent");
    }

    fill(values) {
        for (var campo in values) {
            const valor = values[campo]
            this[campo] = valor;
        }
    }

    getFillables() {
        var values = {};
        for (var prop in this) {
            if (typeof (this[prop]) != 'object'
                && this[prop] != undefined
            ) {
                values[prop] = this[prop]
            }
        }
        return values
    }



    saveInSesion(data) {
        this.sesion.guardar(data)
        // localStorage.setItem('userData', JSON.stringify(data));
        return data;
    }

    getFromSesion() {
        return this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    static async send({
        name,
        info = ""
    }, callbackOk, callbackWrong) {
        const configs = await ModelConfig.get()
        var url = "https://softus.com.ar/" +
            "easypos/add-event"
        /* + 
        "?name=agregar%20producto" + 
        "&user=1414diego" + 
        "&info=informacion%20del%20producto%20o%20productos" + 
        "&project=" + window.location.href
        */

        var data = {
            configs: JSON.stringify(configs),
            name: name,
            info: info,
            project: window.location.href
        }

        const userInfo = await User.getInstance().getFromSesion()
        // console.log("userInfo", userInfo)
        if (userInfo) {
            data.user = JSON.stringify(userInfo)
        }

        // console.log("se enviara esta info como evento", data)

        try {
            const response = await axios.post(url, data);
            if (response.data.statusCode === 200 || response.data.statusCode === 201) {
                if (callbackOk != undefined) callbackOk(response.data, response)
            } else {
                //deberia guardar para enviar mas tarde
            }
        } catch (error) {
        }

    }

};