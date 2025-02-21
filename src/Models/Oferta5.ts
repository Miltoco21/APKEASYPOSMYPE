import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";
import ProductSold from './ProductSold';
import Sales from './Sales';
import ModelConfig from './ModelConfig';
import SoporteTicket from './SoporteTicket';
import EndPoint from './EndPoint';
import IProduct from '../Types/IProduct';
import Sale from './Sale';


import axios from 'axios';

import Model from './Model.js';
import System from '../Helpers/System';


export interface ResultadoAplicarOferta {
  productosQueAplican: any[]
  productosQueNoAplican: any[]
}

class Oferta5 {
  static info: any = null
  static codigosAplicables: any[] = []

  static setInfo(infoOferta) {
    this.info = infoOferta
  }

  static llegoACantidadRequerida(cantidad) {
    var signo = this.info.signo === "=" ? ">=" : this.info.signo
    return eval(cantidad + signo + this.info.cantidad)
  }

  static debeAplicar(productos) {
    // console.log("debeAplicar...para", productos)
    if (this.codigosAplicables.length < 1) this.codigosAplicables = this.info.products.map((pr) => pr.codbarra)

    var cuantosAplican = 0
    productos.forEach(prod => {
      if (this.aplicaProducto(prod)) {
        cuantosAplican += prod.quantity
      }
    });

    return this.llegoACantidadRequerida(cuantosAplican)
  }

  static aplicaProducto(producto) {
    return this.codigosAplicables.indexOf(producto.idProducto) > -1
  }

  static aplicar(productos): ResultadoAplicarOferta {

    if (this.codigosAplicables.length < 1) this.codigosAplicables = this.info.products.map((pr) => pr.codbarra)


    const resul: ResultadoAplicarOferta = {
      productosQueAplican: [],
      productosQueNoAplican: []
    }

    var reempladoDePrecioUnidad = this.info.monto / this.info.cantidad
    var cantidadAcumulada = 0
    var seAplico = false

    productos.forEach(prod => {
      if (!seAplico && this.aplicaProducto(prod)) {

        if (cantidadAcumulada === 0 && this.llegoACantidadRequerida(prod.quantity)) {
          const copiaProd = System.clone(prod)

          const copiaAplica = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.quantity = this.info.cantidad//porque tiene igual o mas
          copiaAplica.price = reempladoDePrecioUnidad
          copiaAplica.updateSubtotal()
          resul.productosQueAplican.push(copiaAplica)

          var cantidadRestante = prod.quantity - this.info.cantidad
          if (cantidadRestante > 0) {
            const copiaNoAplica = new ProductSold()
            copiaNoAplica.fill(copiaProd)
            copiaNoAplica.quantity = cantidadRestante//toma lo que se paso
            copiaNoAplica.updateSubtotal()
            resul.productosQueNoAplican.push(copiaNoAplica)
          }
          seAplico = true
        } else if (this.llegoACantidadRequerida(prod.quantity + cantidadAcumulada)) {
          // revisar si sobre paso 
          var cantidadAplica = this.info.cantidad - cantidadAcumulada
          var cantidadSobra = cantidadAcumulada + prod.quantity - this.info.cantidad
          /*
          llegar a 7
          viene con 3
          este prod tiene 6
          ..
          aplica a 4 unidades de este prod... 7 -  (3).. 4
          sobran 2 unidades de este prod... 3 + 6 - 7 .. 2
          */
          const copiaProd = System.clone(prod)

          const copiaAplica = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.quantity = cantidadAplica
          copiaAplica.price = reempladoDePrecioUnidad
          copiaAplica.updateSubtotal()
          resul.productosQueAplican.push(copiaAplica)

          seAplico = true

          if (cantidadSobra > 0) {
            const copiaNoAplica = new ProductSold()
            copiaNoAplica.fill(copiaProd)
            copiaNoAplica.quantity = cantidadSobra
            copiaNoAplica.updateSubtotal()
            resul.productosQueNoAplican.push(copiaNoAplica)
          }
        } else {
          //lo acumulado no llega a lo requerido

          /*
          llegar a 7
          viene con 2
          este prod tiene 1
          ..
          aplica a 4 unidades de este prod... 7 -  (3).. 4
          sobran 2 unidades de este prod... 3 + 6 - 7 .. 2
          */

          const copiaProd = System.clone(prod)

          const copiaAplica = new ProductSold()
          copiaAplica.fill(copiaProd)
          copiaAplica.price = reempladoDePrecioUnidad
          copiaAplica.updateSubtotal()
          resul.productosQueAplican.push(copiaAplica)

          cantidadAcumulada += prod.quantity
        }

      } else {
        resul.productosQueNoAplican.push( System.clone(prod) )
      }

    })


    return resul
  }

};

export default Oferta5;