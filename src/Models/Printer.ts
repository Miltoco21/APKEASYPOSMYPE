import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";
import MovimientoCaja from "../Types/MovimientoCaja";
import axios from "axios";
import Model from './Model';
import ModelConfig from './ModelConfig';
import System from '../Helpers/System';

import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import Log from './Log';

class Printer {
    static arrPrints = []

    static instance: Printer | null = null;
    static popupwindow: any = null;

    static rePrints = 0
    static rePrintsTotal = 0
    static arrPrintsRepPints = []

    static afterPrintFunction = () => { }

    static printerInited = false
    static printerIntentConect = 0
    static printerConnected = false

    static getInstance(): Printer {
        if (Printer.instance == null) {
            Printer.instance = new Printer();
        }

        return Printer.instance;
    }

    static async printSimple(imprimirTxt) {
        console.log("print simple")
        console.log(imprimirTxt)
        let simplePrintWindow: any = window.open("about:blank", "printsimple", `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no` +
            `,width=` + await ModelConfig.get("widthPrint") + `,left=0,top=0`);

        simplePrintWindow.document.write(imprimirTxt)
        simplePrintWindow.document.write(
            `<script>
            window.print();
            setTimeout(() => {
                console.log("cerrando")
                window.close();
            }, 500);
            <\/script>`
        );
    }

    static async printFlat(imprimirTxt) {
        if (imprimirTxt.trim() == "") return
        // console.log("va a imprimir esto:")
        // console.log(imprimirTxt)
        // console.log("fin de imprimir")
        if (!Printer.popupwindow) {
            let newWin: any = window.open("about:blank", "printx", `scrollbars=no,resizable=no,` +
                `status=no,location=no,toolbar=no,menubar=no` +
                `,width=80,left=0,top=0`);
            Printer.popupwindow = newWin
        }


        Printer.popupwindow.document.querySelector("body").innerHTML = ""
        Printer.popupwindow.document.write(imprimirTxt)
        Printer.popupwindow.document.write(
            `<script>
                setTimeout(() => {
                    window.print();
                }, ` + (await ModelConfig.get("delayCloseWindowPrints") * 1000) + `);
            <\/script>`
        );


    }

    static printAll(respuestaServidor, rePrintsTotal = 1) {
        // console.log("printAll")
        const keys = Object.keys(respuestaServidor)
        var encontroImprimir = false
        if (keys.length > 0) {
            keys.forEach((key) => {
                if (key.toLocaleLowerCase().indexOf("imprimir") > -1) {
                    Printer.arrPrints = respuestaServidor[key]
                    Printer.arrPrintsRepPints = System.clone(respuestaServidor[key])
                    encontroImprimir = true
                }
            })
        }
        if (encontroImprimir) {
            Printer.rePrints = 0
            if (rePrintsTotal < 1) rePrintsTotal = 1
            Printer.rePrintsTotal = rePrintsTotal
            Printer.doPrints()
        }


    }

    


    static async doPrints() {
        var does = false
        // console.log("doPrints")
        // console.log(Object.keys(Printer.arrPrints))
        const keyItems = Object.keys(Printer.arrPrints)
        const hasToProcess = keyItems.length
        if (hasToProcess < 1) {
            // console.log("end to print")
            this.rePrints++
            if (this.rePrints < this.rePrintsTotal) {
                Printer.arrPrints = Printer.arrPrintsRepPints
                this.doPrints()
                return
            }
            // if(Printer.popupwindow){
            //     Printer.popupwindow.document.write(
            //         `<script>
            //         setTimeout(() => {
            //             console.log("cerrando")
            //             window.close();
            //             }, ` + (await ModelConfig.get("delayCloseWindowPrints") * 1000 ) + `);
            //             <\/script>`
            //     );
            // }


            // Printer.popupwindow = null
            // window.focus()

            return
        }
        keyItems.forEach(async (itPrint) => {
            if (itPrint != undefined && !does) {
                does = true
                console.log("do print item: ")
                console.log(itPrint)

                // Printer.printFlat(Printer.arrPrints[itPrint])

                // print bluetooth
                if (Printer.printerConnected) {
                    console.log("imprimiendo en bluetooth", itPrint)
                    // this.impEnter()
                    // this.impTexto(itPrint)
                    // this.impEnter()
                } else {

                    console.log("no se va a imprimir en bluetooth")
                }
                // fin print bluetooth

                delete Printer.arrPrints[itPrint]

                // console.log("quedo asi luego de elimiar el item")
                // console.log(Printer.arrPrints)

                // console.log("voy a tardar entre impresiones: " + ModelConfig.get("delayBetwenPrints"))

                setTimeout(() => {
                    Printer.doPrints()
                }, (await ModelConfig.get("delayBetwenPrints")) * 1000);
                return
            }
        })
    }

};

export default Printer;