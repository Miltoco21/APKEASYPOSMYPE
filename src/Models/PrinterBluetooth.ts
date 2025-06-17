import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";
import MovimientoCaja from "../Types/MovimientoCaja";
import axios from "axios";
import Model from './Model';
import ModelConfig from './ModelConfig';
import System from '../Helpers/System';

import {
    BluetoothManager,
    BluetoothEscposPrinter,
    BluetoothTscPrinter,
    BARCODE_EAN13
} from 'react-native-bluetooth-escpos-printer';
import Log from './Log';
import User from './User';
import { Alert } from 'react-native';

class PrinterBluetooth {
    static printerInited = false
    static printerIntentConect = 0
    static printerConnected = false
    static lastAlign = ""

    static async prepareBluetooth(callback) {
        // Alert.alert("prepareBluetooth")
        PrinterBluetooth.printerInited = (await ModelConfig.get("impresoraBluetooth")) != ""
        if (PrinterBluetooth.printerInited) {
            const dis = JSON.parse(await ModelConfig.get("impresoraBluetooth"))
            this.conectarBlue(dis.address, callback)
        } else {
            // Alert.alert("Not initiated")
        }
    }

    static async conectarBlue(address, callback) {
        // Log("conectarBlue3..", address)
        await BluetoothManager.connect(address) // the device address scanned.
            .then(async (s) => {
                // this.setState({
                //   loading: false,
                //   boundAddress: direccionDispositivo
                // })
                // alert("Conectado correctamente")
                callback()
                // setDispositivosConectados([...dispositivosConectados, dispositivoObj])
                PrinterBluetooth.printerConnected = true
                try {
                    await BluetoothEscposPrinter.printerInit();
                } catch (er) {
                    System.mostrarError(er)
                }
            }, (e) => {
                PrinterBluetooth.printerIntentConect++
                // Alert.alert("PrinterBluetooth.printerIntentConect" + PrinterBluetooth.printerIntentConect)
                if (PrinterBluetooth.printerIntentConect < 5) {
                    // Alert.alert("Reintentando conexion a bluetooth")
                    setTimeout(() => {
                        PrinterBluetooth.conectarBlue(address, callback)
                    }, 1000);
                } else {
                    // Alert.alert("Se han superado los intentos permitidos")
                    Alert.alert("No se pudo conectar a la impresora bluetooth")
                }
            })
    }


    static async desvincularDispositivo(address) {
        await BluetoothManager.unpaire(address) // the device address scanned.
            .then((s) => {
                Alert.alert("Desvinculado correctamente")
            }, (e) => {
                System.mostrarError(e);
            })
    }


    static async impAlignIzquierda() {
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.LEFT
        );
        this.lastAlign = BluetoothEscposPrinter.ALIGN.LEFT
    }

    static async impAlignCentro() {
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER
        );
        this.lastAlign = BluetoothEscposPrinter.ALIGN.CENTER
    }

    static async impAlignDerecha() {
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.RIGHT
        );
        this.lastAlign = BluetoothEscposPrinter.ALIGN.RIGHT
    }
    static async impQR(contenido) {
        await BluetoothEscposPrinter.printQRCode(contenido, 120, 0);
    }

    static async impCols() {
        let columnWidths = [12, 7, 7, 7];
        await BluetoothEscposPrinter.printColumn(columnWidths,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT
            ],
            ["texto1", 'texto2', 'texto3', 'texto4'], {});
    }


    static checkLen(content, maxLen, align = null) {
        var res = []
        var me = this

        if (content.length <= maxLen) return content

        if (!align) align = me.lastAlign
        if (!align) align = BluetoothEscposPrinter.ALIGN.LEFT

        const contentArr = content.split(" ")
        var acum = ""
        contentArr.forEach(palabra => {
            palabra += " "
            if ((acum + palabra).length < maxLen) {
                acum += palabra
            } else if ((acum + palabra).length == maxLen) {
                res.push(acum + palabra)
                acum = ""
            } else {//es > que maxLen
                if (acum == "") {
                    const arrs = System.partirCada(palabra, maxLen)
                    var ixArr = 0
                    while (ixArr < arrs.length && arrs[ixArr] != "") {
                        ixArr++
                        if (arrs[ixArr].length == maxLen) {
                            res.push(arrs[ixArr])
                        } else {
                            acum = arrs[ixArr]
                        }
                    }
                } else {
                    const diff = maxLen - acum.length
                    if (align == BluetoothEscposPrinter.ALIGN.CENTER) {
                        const des = Math.floor(diff / 2)
                        const an = diff - des
                        res.push(" ".repeat(an) + acum + " ".repeat(des))
                    }

                    if (align == BluetoothEscposPrinter.ALIGN.LEFT) {
                        res.push(acum + " ".repeat(diff))
                    }

                    if (align == BluetoothEscposPrinter.ALIGN.RIGHT) {
                        res.push(" ".repeat(diff) + acum)
                    }

                    acum = palabra
                }
            }
        });
        if (acum != "") {//quedo algo
            res.push(acum)
        }

        return res.join(" ")
    }

    static async impProduct(product) {

        // var me = this
        // return
        let columnWidths = [4, 20, 7];
        var me = this
        await BluetoothEscposPrinter.printColumn(columnWidths,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT
            ], [
            product.cantidad + "",
            me.checkLen(product.descripcion, 19, BluetoothEscposPrinter.ALIGN.CENTER),
            (product.precioUnidad * product.cantidad) + "",
        ], {});
    }

    static async impHeaderProduct() {
        let columnWidths = [5, 20, 7];
        await BluetoothEscposPrinter.setBlob(2)
        await BluetoothEscposPrinter.printColumn(columnWidths,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT
            ], [
            "cant",
            "desc.",
            "subt.",
        ], {});
        await BluetoothEscposPrinter.setBlob(0)
    }

    static async impImg(imagen) {
        console.log("impImg")

        try {
            await BluetoothEscposPrinter.printText("" + "\n", {});
            await BluetoothEscposPrinter.printPic(imagen, {
                // width: 500,
                // height: 100
            });

            console.log("se supone que imprimio")
        } catch (e) {
            console.log(e)
        }
    }

    static async impTexto(texto) {
        await BluetoothEscposPrinter.printText(texto + "\n", {});
    }

    static async impTextoSubrayado(texto) {
        await BluetoothEscposPrinter.printerUnderLine(1);
        this.impTexto(texto)
        await BluetoothEscposPrinter.printerUnderLine(0);
    }

    static async impTextoGrandeSubrayado(texto) {
        await BluetoothEscposPrinter.printerUnderLine(1);
        this.impTextoGrande(texto)
        await BluetoothEscposPrinter.printerUnderLine(0);
    }

    static async impTextoGrande(texto, options = null) {
        const optionsDefault = {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 1,
            heigthtimes: 1,
            fonttype: 0
        }
        if (!options) options = optionsDefault
        await BluetoothEscposPrinter.printText(this.checkLen(texto, 16) + "\n", options);
    }

    static async impEnter() {
        await BluetoothEscposPrinter.printText("\n\r", {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 1,
            heigthtimes: 1,
            fonttype: 0
        });
    }

    static async impBarra(contenido) {
        await BluetoothEscposPrinter.printBarCode(contenido,
            BluetoothEscposPrinter.BARCODETYPE.JAN13,
            3,
            120,
            0,
            2
        );
    }


    static async imprimirAlgunosCodigos() {
        try {
            this.impBarra("7509552906448")
            this.impTexto("SHAMPOO FRUCTIS 350ML GUARANA")
            this.impEnter()

            this.impBarra("7801610001295")
            this.impTexto("COCA COLA ORIGINAL 2L")
            this.impEnter()

            this.impBarra("7801620009694")
            this.impTexto("CACHANTUN")
            this.impEnter()
        } catch (er) {
            alert(er)
        }
    }

    static async doDetailSale(requestBody, response) {
        if (requestBody.products.length < 1) return
        var comercioRazon = ""
        var comercioGiro = ""
        var comercioRut = ""
        var comercioDireccion = ""

        await Model.getServerImpresionConfigs((serverConfigs) => {
            serverConfigs.forEach((serverConfig) => {
                if (serverConfig.grupo === "ImpresionTicket") {
                    if (serverConfig.entrada === "Nom_Direccion") {
                        comercioDireccion = serverConfig.valor
                    }
                    if (serverConfig.entrada === "Nom_Giro") {
                        comercioGiro = serverConfig.valor
                    }
                    if (serverConfig.entrada === "Nom_RazonSocial") {
                        comercioRazon = serverConfig.valor
                    }
                    if (serverConfig.entrada === "Nro_Rut") {
                        comercioRut = serverConfig.valor
                    }
                }
            });
        }, () => { });

        await this.impEnter()
        await this.impAlignCentro()
        if (comercioRazon != "") await this.impTextoGrande(comercioRazon)
        if (comercioRut != "") await this.impTexto(comercioRut)
        if (comercioDireccion != "") await this.impTexto(comercioDireccion)
        if (comercioGiro != "") await this.impTexto(comercioGiro)

        await this.impAlignIzquierda()

        const user = new User()
        var infoUser = await user.getFromSesion()
        await this.impTexto("Usuario: " + infoUser.codigoUsuario + " - " + infoUser.nombres + " " + infoUser.apellidos)
        await this.impTexto("Sucursal: " + await ModelConfig.get("sucursal"))
        await this.impTexto("Punto venta: " + await ModelConfig.get("puntoVenta"))

        var totalEnvases = 0
        if (requestBody.products.length > 0) {
            await this.impEnter()
            await this.impHeaderProduct()
            requestBody.products.forEach(async (prod) => {
                // Log("prod", prod)
                if (prod.descripcion == "Envase") {
                    if (prod.cantidad > 0) {
                        totalEnvases += (prod.cantidad * prod.precioUnidad)
                    }
                } else {
                    await this.impProduct(prod)
                }
            })
        }


        var metodosPago = ""
        requestBody.pagos.forEach((pago) => {
            if (metodosPago != "") metodosPago += ", "
            metodosPago += pago.metodoPago
        })
        await this.impTexto(metodosPago)

        await this.impTexto("Fecha " + System.formatDateServer(requestBody.fechaIngreso))
        await this.impAlignDerecha()
        await this.impTexto("Total: $" + requestBody.subtotal + "")
        await this.impTexto("T.Envase: $" + totalEnvases + "")//envase
        await this.impTexto("Descuento: $0")
        await this.impTexto("Pagado: $" + requestBody.totalPagado)
        await this.impTexto("Redondeado: $" + requestBody.totalRedondeado)
        await this.impTexto("Vuelto: $" + requestBody.vuelto)

        if (response.pdf417) {
            console.log("tiene pdf417 deberia imprimir")
            await this.impImg(response.pdf417)
        }else{
            console.log("no tiene pdf417")
        }
        await this.impEnter()
        await this.impAlignCentro()
        await this.impTexto("www.easypos.cl")
        await this.impEnter()
        await this.impEnter()


        const dis = JSON.parse(await ModelConfig.get("impresoraBluetooth"))
        // await this.desvincularDispositivo(dis.address)
    }

    static async doStartWork(requestBody, response) {
        await this.impEnter()
        await this.impAlignCentro()
        await this.impTextoGrandeSubrayado("Inicio de Caja")
        await this.impAlignIzquierda()
        await this.impTexto("Valor: $" + requestBody.monto)

        await this.impTexto("Fecha / Hora: ")
        await this.impTexto(System.formatDateServer(requestBody.fechaIngreso))

        const user = new User()
        var infoUser = await user.getFromSesion()
        await this.impTexto("Usuario: " + infoUser.codigoUsuario + " - " + infoUser.nombres + " " + infoUser.apellidos)
        await this.impTexto("Sucursal: " + await ModelConfig.get("sucursal"))
        await this.impTexto("Punto venta: " + await ModelConfig.get("puntoVenta"))

        await this.impEnter()
    }


    static async doEndWork(requestBody, response) {
        Log("doEndWork..requestBody", requestBody)
        Log("doEndWork..response", response)

        await this.impEnter()
        await this.impAlignCentro()
        await this.impTextoGrandeSubrayado("Cierre de Caja")
        await this.impAlignIzquierda()

        await this.impTexto("Fecha / Hora: ")
        await this.impTexto(System.formatDateServer(requestBody.fechaIngreso))

        // const user = new User()
        // var infoUser = await user.getFromSesion()
        await this.impTexto("Turno: " + requestBody.idTurno)
        await this.impTexto("Venta total: $ " + requestBody.totalSistema)
        await this.impTexto("Diferencia: $ " + requestBody.diferencia)

        await this.impTexto("Usuario: " + requestBody.userInfo.codigoUsuario + " - " + requestBody.userInfo.nombres + " " + requestBody.userInfo.apellidos)
        await this.impTexto("Sucursal: " + await ModelConfig.get("sucursal"))
        await this.impTexto("Punto venta: " + await ModelConfig.get("puntoVenta"))

        await this.impEnter()
    }

    static async printAll(requestBody, response) {
        console.log("printAll.. printer bluetooth")
        try {
            await this.impEnter()
        } catch (err) {
            PrinterBluetooth.printerIntentConect = 0
            PrinterBluetooth.prepareBluetooth(() => {
                PrinterBluetooth.printAll(requestBody, response)
            })
            return
        }

        if (PrinterBluetooth.printerConnected) {
            console.log("ok de PrinterBluetooth.printerConnected")
            // Log("requestBody", requestBody)
            // Log("requestBody.operacion", requestBody.operacion)
            if (requestBody.operacion === "detalleVenta") {
                // console.log("operacion detalleVenta")
                await PrinterBluetooth.doDetailSale(requestBody, response)
                console.log("operacion detalleVenta2")
            } else if (requestBody.operacion === "inicioCaja") {
                // console.log("operacion inicioCaja")
                await PrinterBluetooth.doStartWork(requestBody, response)
                console.log("operacion inicioCaja2")
            } else if (requestBody.operacion === "cierreCaja") {
                // console.log("operacion cierreCaja")
                await PrinterBluetooth.doEndWork(requestBody, response)
                console.log("operacion cierreCaja2")
            }
        } else {
            console.log("else de PrinterBluetooth.printerConnected")
        }
    }


};

export default PrinterBluetooth;