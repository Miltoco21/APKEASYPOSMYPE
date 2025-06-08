//import { Height } from "@mui/icons-material";
import CONSTANTS from "../definitions/Constants";
import dayjs from "dayjs";
import ModelConfig from "../Models/ModelConfig";
import { Alert } from "react-native";


class System {
    static instance: System | null = null;

    getAppName() {
        return CONSTANTS.appName + " " + CONSTANTS.appVersion
    }

    static getInstance(): System {
        if (System.instance == null) {
            System.instance = new System();
        }

        return System.instance;
    }


    getWindowWidth() {
        return window.innerWidth;
    }

    getWindowHeight() {
        return window.innerHeight;
    }

    getCenterStyle(widthPercent = 80, heightPercent = 80) {
        return {
            width: (widthPercent * (System.getInstance().getWindowWidth()) / 100) + "px",
            height: (heightPercent * (System.getInstance().getWindowHeight()) / 100) + "px",
            overflow: "auto"
        };
    }

    getMiddleHeigth() {
        return this.getWindowHeight() - 212 - 92 - 300 - 20
    }

    fechaYMD() {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const day = fecha.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    bancosChile() {
        return [
            { id: 1, nombre: "Banco de Chile" },
            { id: 2, nombre: "Banco Santander Chile" },
            { id: 3, nombre: "Banco Estado" },
            { id: 4, nombre: "Scotiabank Chile" },
            { id: 5, nombre: "Banco BCI" },
            { id: 6, nombre: "Banco Itaú Chile" },
            { id: 7, nombre: "Banco Security" },
            { id: 8, nombre: "Banco Falabella" },
            { id: 9, nombre: "Banco Ripley" },
            { id: 10, nombre: "Banco Consorcio" },
            { id: 11, nombre: "Banco Internacional" },
            { id: 12, nombre: "Banco Edwards Citi" },
            { id: 13, nombre: "Banco de Crédito e Inversiones" },
            { id: 14, nombre: "Banco Paris" },
            { id: 15, nombre: "Banco Corpbanca" },
            { id: 16, nombre: "Banco BICE" },
            // Agrega más bancos según sea necesario
        ]
    }

    tiposDeCuenta() {
        return {
            "Cuenta Corriente": "Cuenta Corriente",
            "Cuenta de Ahorro": "Cuenta de Ahorro",
            "Cuenta Vista": "Cuenta Vista",
            "Cuenta Rut": "Cuenta Rut",
            "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
            "Cuenta de Inversión": "Cuenta de Inversión",
        }
    }

    //fechaactual con formato: 2024-05-12T02:06:22.000Z
    getDateForServer(date) {
        return (dayjs(date).format('YYYY-MM-DD HH:mm:ss') + ".000Z").replace(" ", "T")
    }

    en2Decimales(valor) {
        return Math.round(parseFloat(valor) * 100) / 100
    }

    typeIntFloat(value) {
        if ((value + "").indexOf(".") > -1) {
            return parseFloat(value + "")
        } else {
            return parseInt(value + "")
        }
    }

    static clone(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    static getUrlVars() {
        var allStr = window.location.href
        if (allStr.indexOf("?") == -1) {
            return {}
        }
        var [location, allLast] = allStr.split("?")
        var vars = {}
        allLast.split("&").forEach((nameValue) => {
            const [name, value] = nameValue.split("=")
            vars[name] = value
        })
        return vars
    }

    static addInObj(setFunction, fieldName, fieldValue) {
        setFunction((oldProduct) => {
            const newProduct = { ...oldProduct };
            newProduct[fieldName] = fieldValue
            return newProduct;
        });
    }

    static addAllInObj(setFunction, objValues) {
        setFunction((oldProduct) => {
            const newProduct = { ...oldProduct, ...objValues };
            return newProduct;
        });
    }

    static addAllInArr(setFunction, arrayOriginal, index, objValues) {
        const newArr = [...arrayOriginal]
        newArr[index] = objValues
        setFunction(newArr)
    }

    static allValidationOk = (validators, showMessageFunction) => {
        // console.log("allValidationOk:", validators)
        var allOk = true
        // const keys = Object.keys(validators)
        Object.values(validators).forEach((validation: any, ix) => {
            // console.log("validation de  " + keys[ix] + " :", validation)
            if (validation[0].message != "" && allOk) {
                showMessageFunction(validation[0].message)
                allOk = false
            }
        })
        return allOk
    }

    static intentarFoco(textInfoRef) {
        if (!textInfoRef || textInfoRef.current == null) {
            setTimeout(() => {
                this.intentarFoco(textInfoRef)
            }, 300);
        } else {
            textInfoRef.current.focus()
        }
    }

    static formatDateServer(dateServer) {
        const v1 = dateServer.split("T")
        const dt = v1[0]
        const hrs = v1[1]

        const [year, month, day] = dt.split("-")
        const [hr, mn] = hrs.split(":")

        return day + "/" + month + "/" + year + " " + hr + ":" + mn
    }

    static maxStr(str, max, completarConPuntos = true) {
        var txt = str
        console.log("original largo", txt.length)

        //max = 10..str=carambolazo..11 deberia quedar asi 'carambo...'
        if (str.length > max) {
            if (completarConPuntos) {
                txt = txt.substring(0, max - 3) + "..."
            } else {
                txt = txt.substring(0, max)
            }
        }
        console.log("devuelve cortado", txt)
        console.log("largo cortado", txt.length)
        return txt
    }

    static camelToUnderscore(key) {
        return key.replace(/([A-Z])/g, "_$1").toLowerCase();
    }

    static partirCada(elString, cantidadACortar) {
        const stringToRegex = str => {
            // Main regex
            const main = str.match(/\/(.+)\/.*/)[1]

            // Regex options
            const options = str.match(/\/.+\/(.*)/)[1]

            // Compiled regex
            return new RegExp(main, options)
        }

        return elString.match(stringToRegex("/.{1," + cantidadACortar + "}/g"))
    }

    static pagaConEfectivo = (pagos) => {
        var conEfectivo = false
        pagos.forEach((pago) => {
            if (pago.metodoPago == "EFECTIVO") {
                conEfectivo = true
            }
        })
        return conEfectivo
    }


    // ej 152000.157 ----> 152.000,15
    static formatMonedaLocal(valorMoneda, conDecimales = true) {
        if (isNaN(valorMoneda)) return "0,00"
        // console.log("formatMonedaLocal", valorMoneda)
        var monedaStr = valorMoneda + ""
        var parteEntera = monedaStr
        var parteDecimal = "00"
        if (monedaStr.indexOf(".") > -1) {
            const partes = monedaStr.split(".")
            parteEntera = partes[0]
            parteDecimal = partes[1]
        }

        if (parteDecimal.length < 2) parteDecimal += "0"
        if (parteDecimal.length > 2) {
            const x = parseFloat("0." + parteDecimal).toFixed(2)
            parteDecimal = x.split(".")[1]
        }

        if (parteEntera.length > 3) {
            // console.log("parteEntera.length>3")
            var parteEntera2 = ""
            for (let index = parteEntera.length; index > 0; index--) {
                const current = parteEntera.length - index + 1
                // console.log("current", current)
                const digitoEntero = parteEntera[index - 1];
                parteEntera2 = digitoEntero + parteEntera2
                // console.log("digitoEntero", digitoEntero)
                // console.log("index", index)
                if ((current) % 3 === 0) {
                    // console.log(index + " es divisor de 3")
                    parteEntera2 = "." + parteEntera2
                }
            }

            if (parteEntera2.substr(0, 1) === ".") {
                parteEntera2 = parteEntera2.substr(1)
            }

            parteEntera = parteEntera2
        }

        // console.log("formatMonedaLocal devuelve", parteEntera + "," + parteDecimal)
        if (conDecimales) {
            return parteEntera + "," + parteDecimal
        } else {
            return parteEntera
        }
    }


    // static configBoletaOk() {
    //     const emitirBoleta = ModelConfig.get("emitirBoleta")
    //     const tienePasarelaPago = ModelConfig.get("tienePasarelaPago")

    //     return (emitirBoleta !== null && tienePasarelaPago !== null)
    // }
    static async configBoletaOk() { // Hacer el método async
        const emitirBoleta = await ModelConfig.get("emitirBoleta"); // Esperar la resolución
        const tienePasarelaPago = await ModelConfig.get("tienePasarelaPago");

        return (emitirBoleta !== null && tienePasarelaPago !== null);
    }

    static invertirProps(objeto) {
        const objetoInvertido = {}

        const keys = Object.keys(objeto)

        keys.forEach((key) => {
            const value = objeto[key]
            objetoInvertido[value] = key
        })

        return objetoInvertido
    }

    static arrayFromObject(objeto, invert = false) {
        if (invert) objeto = this.invertirProps(objeto)
        const keys = Object.keys(objeto)
        var ar = []

        keys.forEach((key) => {
            if (objeto[key]) {
                ar[key] = objeto[key]
            }
        })

        return ar
    }


    static arrayIdValueFromObject(objeto, invert) {
        if (invert) objeto = this.invertirProps(objeto)
        const keys = Object.keys(objeto)
        var ar: any = []

        keys.forEach((key) => {
            ar.push({
                id: key,
                value: objeto[key]
            })
        })

        return ar
    }


    static mostrarError(err) {
        var txt = ""
        if (typeof (err) == "object") {
            txt = (err.message)
        } else if (typeof (err) == "string") {
            txt = (err)
        } else {
            txt = ("Error con formato desconocido." + typeof (err))
        }
        Alert.alert(txt)
        return txt
    }

}




export default System;