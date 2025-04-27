import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";
import MovimientoCaja from "../Types/MovimientoCaja";
import axios from "axios";
import Model from './Model';
import ModelConfig from './ModelConfig';
import System from '../Helpers/System';

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import Log from './Log';
import User from './User';

class PrinterBluetooth {
    static printerInited = false
    static printerIntentConect = 0
    static printerConnected = false

    static async prepareBluetooth() {
        console.log("prepareBluetooth")
        // if (PrinterBluetooth.printerInited) return
        PrinterBluetooth.printerInited = (await ModelConfig.get("impresoraBluetooth")) != ""
        if (PrinterBluetooth.printerInited) {
            const dis = JSON.parse(await ModelConfig.get("impresoraBluetooth"))
            this.conectarBlue(dis.address)
        }
    }

    static async conectarBlue(address) {
        Log("conectarBlue3..", address)
        await BluetoothManager.connect(address) // the device address scanned.
            .then(async (s) => {
                // this.setState({
                //   loading: false,
                //   boundAddress: direccionDispositivo
                // })
                // alert("Realizado correctamente")
                // setDispositivosConectados([...dispositivosConectados, dispositivoObj])
                PrinterBluetooth.printerConnected = true
                console.log("conectado correctamente")
                try {
                    await BluetoothEscposPrinter.printerInit();
                } catch (er) {
                    alert("no se pudo iniciar.." + er)
                }
            }, (e) => {
                PrinterBluetooth.printerIntentConect++
                if (PrinterBluetooth.printerIntentConect < 5) {
                    console.log("no se pudo conectar al bluetooth.. reintentando", PrinterBluetooth.printerIntentConect)
                    setTimeout(() => {
                        console.log("en timeout")
                        PrinterBluetooth.conectarBlue(address)
                    }, 1000);
                } else {
                    console.log("no se pudo conectar al bluetooth con intentos")
                }
            })
    }


    static async impAlignIzquierda() {
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.LEFT
        );
    }

    static async impAlignCentro() {
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER
        );
    }

    static async impAlignDerecha() {
        await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.RIGHT
        );
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

    static async impProduct(product) {
        console.log("impProduct", product)
        let columnWidths = [4, 20, 7];
        await BluetoothEscposPrinter.printColumn(columnWidths,
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT
            ], [
            product.cantidad + "",
            product.descripcion,
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
        await BluetoothEscposPrinter.printPic(imagen, {
            width: 120,
            height: 57
        });
    }

    static async impTexto(texto) {
        console.log("impTexto2--texto:", texto)
        try {
            await BluetoothEscposPrinter.printText(texto + "\n", {});
        } catch (err) {
            alert(err)
        }
        // await BluetoothEscposPrinter.printAndFeed(1);
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
        console.log("impTexto--texto:", texto, "..options:", options)
        try {
            await BluetoothEscposPrinter.printText(texto + "\n", options);
        } catch (err) {
            alert(err)
        }
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


    static async printAll(requestBody, response) {
        console.log("printAll")
        try{
            await this.impEnter()
        }catch(err){
            PrinterBluetooth.printerIntentConect = 0
            PrinterBluetooth.prepareBluetooth()
            setTimeout(() => {
                PrinterBluetooth.printAll(requestBody, response)
                console.log("error:" + err + "..se reintentara")
            }, 1000);
            return
        }
        if (requestBody.products.length < 1) return
        var comercioRazon = ""
        var comercioGiro = ""
        var comercioRut = ""
        var comercioDireccion = ""

        await Model.getServerConfigs((serverConfigs) => {
            // Log("serverConfigs", serverConfigs)
            serverConfigs.forEach((serverConfig) => {
                if (serverConfig.grupo === "Ticket") {
                    if (serverConfig.entrada === "Direccion") {
                        comercioDireccion = serverConfig.valor
                    }
                    if (serverConfig.entrada === "Giro") {
                        comercioGiro = serverConfig.valor
                    }
                    if (serverConfig.entrada === "RazonSocial") {
                        comercioRazon = serverConfig.valor
                    }
                    if (serverConfig.entrada === "Rut") {
                        comercioRut = serverConfig.valor
                    }
                }
            });
        }, () => { });



        if (PrinterBluetooth.printerConnected) {
            this.impEnter()
            this.impAlignCentro()
            if (comercioRazon != "") this.impTextoGrande(comercioRazon)
            if (comercioRut != "") this.impTexto(comercioRut)
            if (comercioDireccion != "") this.impTexto(comercioDireccion)
            if (comercioGiro != "") this.impTexto(comercioGiro)

            // this.impEnter()
            this.impAlignIzquierda()

            const user = new User()
            var infoUser = await user.getFromSesion()
            this.impTexto("Usuario: " + infoUser.codigoUsuario + " - " + infoUser.nombres + " " + infoUser.apellidos)
            this.impTexto("Sucursal: " + await ModelConfig.get("sucursal"))
            this.impTexto("Punto venta: " + await ModelConfig.get("puntoVenta"))

            if (requestBody.products.length > 0) {
                await this.impEnter()
                await this.impHeaderProduct()
                requestBody.products.forEach(async(prod) => {
                    await this.impProduct(prod)
                })
            }

            // console.log("comercioRut", comercioRut)

            var metodosPago = ""
            requestBody.pagos.forEach((pago) => {
                if (metodosPago != "") metodosPago += ", "
                metodosPago += pago.metodoPago
            })
            this.impTexto(metodosPago)

            this.impTexto("Fecha " + System.formatDateServer(requestBody.fechaIngreso))
            this.impAlignDerecha()
            this.impTexto("Total: $" + requestBody.total + "")
            this.impTexto("T.Envase: $0")//envase
            this.impTexto("Descuento: $0")
            this.impTexto("Pagado: $" + requestBody.totalPagado)
            this.impTexto("Redondeado: $" + requestBody.totalRedondeado)
            this.impTexto("Vuelto: $" + requestBody.vuelto)

            this.impEnter()
            this.impAlignCentro()
            this.impTexto("www.easypos.cl")
            this.impEnter()
            this.impEnter()

        } else {

            console.log("no se va a imprimir en bluetooth")
        }
    }


};

export default PrinterBluetooth;