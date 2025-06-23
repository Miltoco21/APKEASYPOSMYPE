import StorageSesion from '../Helpers/StorageSesion.js';
import IProduct from '../Types/IProduct.js';
import Model from './Model.js';
import BaseConfig from "../definitions/BaseConfig.js";
import axios from 'axios';
import ModelConfig from './ModelConfig.js';
import EndPoint from './EndPoint.js';
import ProductSold from './ProductSold.js';
import System from '../Helpers/System.js';


class ProductCodeStack extends Model {

    static interval: any = null
    static list: ProductSold[] = []
    static processFunction: any = null

    static instance: ProductCodeStack | null = null;
    static getInstance(): ProductCodeStack {
        if (ProductCodeStack.instance == null) {
            ProductCodeStack.instance = new ProductCodeStack();
        }

        return ProductCodeStack.instance;
    }

    static process() {
        const item = ProductCodeStack.list.splice(0, 1)
        // console.log("process de ProductCodeStack.. procesando", item)

        if (ProductCodeStack.processFunction !== null) {
            ProductCodeStack.processFunction(item[0])
        }
        if (ProductCodeStack.list.length < 1) {
            clearInterval(ProductCodeStack.interval)
            ProductCodeStack.interval = null
        }
    }

    static addProductCode(codigo) {
        console.log("addProductCode.. de ProductStack..")
        console.log("codigo", codigo)
        const largo = codigo.length
        // if (largo % 13 == 0) {
            // console.log("es multiplo de 13")
            if (largo >= 13) {
                // console.log("es > 13")
                const cortado = codigo.substr(0, 13)
                // console.log("cortado", cortado)
                // console.log("loquesobra", loquesobra)
                this.list.push(cortado)
                if(largo>13){
                    const loquesobra = codigo.substr(13)
                    this.addProductCode(loquesobra)
                    return
                }
            }else{
                // console.log("no es > 13")
                // console.log("add product code", codigo)
                this.list.push(codigo)
            }
            if (ProductCodeStack.interval === null) {
                ProductCodeStack.interval = setInterval(() => {
                    ProductCodeStack.process()
                }, 300);
            }
        // }
    }

    };



export default ProductCodeStack;