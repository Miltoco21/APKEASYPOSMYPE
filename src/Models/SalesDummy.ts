import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";
import Product from './Product';
//import IProductSold from '../Types/IProductSold';
import Singleton from './Singleton';
import ProductSold from './ProductSold';
import axios from 'axios';
import ModelConfig from './ModelConfig';
import Sales from './Sales';


class SalesDummy extends Sales{

    constructor(){
      super()
      this.sesionProducts = new StorageSesion("dummy_sales_products");
    }

    //el original cambia al envase su misma cantidad
    checkQuantityEnvase(index){
    }


    changeQuantityByIndex(index, quantity, removeIfQuantityIs0 = false){
        this.products[index].quantity = quantity;
        this.products[index].updateSubtotal();

        this.checkQuantityEnvase(index)

        if(removeIfQuantityIs0 && this.products[index].quantity <= 0){
          console.log("eliminando")
            this.products.splice(index,1);
        }
        this.sesionProducts.guardar(this.products)
        return(this.products);
    }

    removeFromIndex(index){
      if(this.products.length<1) this.loadFromSesion()
      return super.removeFromIndex(index)
    }
};


export default SalesDummy;