import StorageSesion from '../Helpers/StorageSesion';
import ModelConfig from './ModelConfig';
import EndPoint from './EndPoint';
import Singleton from './Singleton';
import Log from './Log';

class User extends Singleton {

    sesion = null

    constructor() {
        super()
        this.sesion = new StorageSesion("User");
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

    async getFromSesion() {
        return await this.sesion.cargar(1)
        // var dt = localStorage.getItem('userData') || "{}";
        // return JSON.parse(dt);
    }

    setRutFrom = (input) => {
        if (input.indexOf("-") > -1) {
            this.rut = input;
        } else {
            this.rut = "";
        }
        return this.rut;
    }

    setUserCodeFrom = (input) => {
        if ((input + "").indexOf("-") == -1) {
            this.codigoUsuario = parseInt(input);
        } else {
            this.codigoUsuario = 0;
        }
        return this.codigoUsuario;
    }

    setPassword = (input) => {
        this.clave = input
    }

    async doLoginInServer(callbackOk, callbackWrong) {
        // console.log("haciendo doLoginInServer")
        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/LoginUsuario"

        const data = {
            codigoUsuario: this.codigoUsuario,
            rut: this.rut,
            clave: this.clave,
        }

        if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta")
        if (!data.idEmpresa) data.idEmpresa = await ModelConfig.get("idEmpresa")

        // Log("data a enviar", data)
        // console.log("url", url)

        await EndPoint.sendPost(url, data, (responseData, response) => {
            if (response.data.responseUsuario
                && response.data.responseUsuario.codigoUsuario != -1
            ) {
                if (!response.data.responseUsuario.activo) {
                    callbackOk(responseData);
                } else {
                    callbackWrong("Usuario activo en otra sesión");
                }
            } else {
                // Log("aca debe enviar correo", response)
                // EndPoint.admError(response, callbackWrong)
                callbackWrong(response.data.descripcion);
            }
        }, callbackWrong)
    }


    async checkLicenciaLogin(callbackOk, callbackWrong) {
        var url = "https://softus.com.ar/easypos"
            + "/check-buyed-licence"

        const data = {
            unitName: "Mype",
            user: this.rut,
            pass: this.clave,
        }
        if (!data.user) data.user = this.codigoUsuario

        // Log("this", this)
        // Log("data a enviar", data)
        // console.log("url", url)

        var me = this
        await EndPoint.sendPost(url, data, (responseData, response) => {
            // Log("response", response)
            if (response.data.status) {
                callbackOk(response)
            } else {
                callbackWrong("Datos incorrectos");
            }
        }, callbackWrong)
    }

    async doLogoutInServer(callbackOk, callbackWrong) {
        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/LoginUsuarioSetInactivo"

        const data = {
            codigoUsuario: this.codigoUsuario,
        }

        if (!data.codigoSucursal) data.codigoSucursal = await ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = await ModelConfig.get("puntoVenta")
        if (!data.idEmpresa) data.idEmpresa = await ModelConfig.get("idEmpresa")


        // console.log("doLogoutInServer")
        // console.log("url", url)
        // console.log("data", data)

        await EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(response);
        }, callbackWrong)
    }

    async getAllFromServer(callbackOk, callbackWrong) {
        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetAllUsuarios"

        url += "?codigoSucursal=" + await ModelConfig.get("sucursal")
        url += "&puntoVenta=" + await ModelConfig.get("puntoVenta")

        await EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async getUsuariosDeudas(callbackOk, callbackWrong) {
        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetUsuariosDeudas"

        url += "?codigoSucursal=" + await ModelConfig.get("sucursal")
        url += "&puntoVenta=" + await ModelConfig.get("puntoVenta")

        await EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarioDeudas, response);
        }, callbackWrong)
    }

    static async getByRut(rut, callbackOk, callbackWrong) {
        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/GetUsuarioByRut"

        url += "?codigoSucursal=" + await ModelConfig.get("sucursal")
        url += "&puntoVenta=" + await ModelConfig.get("puntoVenta")
        url += "&rutUsuario=" + rut

        // console.log("getByRut..")
        // console.log("url..", url)

        await EndPoint.sendGet(url, (responseData, response) => {
            callbackOk(responseData.usuarios, response);
        }, callbackWrong)
    }

    async pargarDeudas(callbackOk, callbackWrong) {
        const data = this.getFillables()
        if (data.idUsuario == undefined) { console.log("falta completar idUsuario"); return }
        if (data.montoPagado == undefined) { console.log("faltan completar montoPagado"); return }
        if (data.metodoPago == undefined) { console.log("faltan completar metodoPago"); return }
        if (this.deudaIds == undefined) { console.log("faltan completar deudaIds"); return }

        data.deudaIds = this.deudaIds

        const configs = await ModelConfig.get()
        var url = configs.urlBase
            + "/api/Usuarios/PostUsuarioPagarDeudaByIdUsuario"

        if (!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if (!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")
        if (!data.idEmpresa) data.idEmpresa = ModelConfig.get("idEmpresa")

        await EndPoint.sendPost(url, data, (responseData, response) => {
            callbackOk(responseData, response);
        }, callbackWrong)
    }

};

export default User;