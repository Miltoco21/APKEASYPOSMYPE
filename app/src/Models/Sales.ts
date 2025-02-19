import StorageSesion from '../Componentes/Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";
import Product from '../Models/Product';
import ProductSold from '../Models/ProductSold';

import Singleton from './Singleton';

import axios from 'axios';
import System from '../Componentes/Helpers/System';

import Preventa from '../Models/Preventa';


class Sales {
  products: ProductSold[] = []
  sesionProducts: StorageSesion;

  constructor() {
    this.sesionProducts = new StorageSesion("salesproducts");
  }

  loadFromSesion() {

    console.log("loadFromSesion")
    console.log("productos", this.products)
    return this.products
    if (!this.sesionProducts.hasOne()) return [];
    this.products = [];
    var prodsSession = this.sesionProducts.cargarGuardados()[0];
    for (let index = 0; index < prodsSession.length; index++) {
      const prodSold = new ProductSold();
      prodSold.fill(prodsSession[index]);
      this.products[index] = prodSold
    }
    return (this.products);
  }

  findKeyInProducts(productId: number): number {
    return this.products.findIndex(
      (productSold: ProductSold) => productSold.idProducto === productId
    );
  }

  findKeyAndPriceInProducts(productId: number, price): number {
    return this.products.findIndex(
      (productSold: ProductSold) => (
        productSold.idProducto === productId
        && productSold.price === price
      )
    );
  }

  findKeyAndPriceAndNameInProducts(productId: number, price, name): number {
    return this.products.findIndex(
      (productSold: ProductSold) => (
        productSold.idProducto + "" === productId + ""
        && productSold.idProducto !== 0
        && productSold.price === price
        && productSold.description === name
      )
    );
  }

  getTotal() {
    var allTotal = 0;
    this.products.forEach(function (product: ProductSold) {
      allTotal = allTotal + product.getSubTotal();
    })
    return allTotal;
  }

  getTotalCantidad() {
    var allTotal = 0;
    this.products.forEach(function (product: ProductSold) {
      allTotal = allTotal + product.quantity;
    })
    return allTotal;
  }

  incrementQuantityByIndex(index, quantity = 1, newPrice = 0) {
    const updatedSalesData = [...this.products];
    updatedSalesData[index] =
      updatedSalesData[index].addQuantity(quantity, newPrice);
    this.products = updatedSalesData;
    return (updatedSalesData);
  }

  decrementQuantityByIndex(index) {
    // console.log("decrementQuantityByIndex")
    // console.log("revisar quantity de envases?")
    const updatedSalesData = [...this.products];
    updatedSalesData[index] =
      updatedSalesData[index].addQuantity(-1);

    if (updatedSalesData[index].quantity < 1) {
      updatedSalesData.splice(index, 1);
    }
    return (updatedSalesData);
  }

  checkQuantityEnvase(index, product: any = null) {
    // console.log("checkQuantityEnvase..index:", index)
    var productoCambiando = this.products[index];
    if (productoCambiando.hasEnvase != undefined) {
      // console.log("tiene un envase")
      const ownerEnvaseId = productoCambiando.idProducto//producto con envase
      if (ownerEnvaseId === 0) {
        // console.log("tiene id 0 el owner del envase")
      } else {
        // console.log("es un producto valido el owner del envase", ownerEnvaseId)
        // if(productoCambiando.preVenta){
        //   return // si es preventa no tiene que revisar envase porque el envase viene como un producto separado
        // }

        for (let index2 = 0; index2 < this.products.length; index2++) {
          const posibleEnvase = this.products[index2];
          // console.log("posible envase", System.clone(posibleEnvase))
          // console.log("productoCambiando", System.clone(productoCambiando))

          if (ownerEnvaseId == posibleEnvase.ownerEnvaseId) {//encontro su envase
            // console.log("confirmado es un envase del product ", ownerEnvaseId)

            if (product && ProductSold.tieneEnvases(product)) {
              var cantidadEnvase = product.envase[0].cantidad
              if (!cantidadEnvase) cantidadEnvase = product.envase[0].quantity
              if (!cantidadEnvase) cantidadEnvase = 1
              posibleEnvase.quantity += cantidadEnvase
            } else {
              posibleEnvase.quantity = productoCambiando.quantity
            }
            posibleEnvase.updateSubtotal()
          }
        }
      }
    }
  }

  changeQuantityByIndex(index, quantity, removeIfQuantityIs0 = false) {
    // console.log("this")
    // console.log(this)
    this.products[index].quantity = quantity;
    this.products[index].updateSubtotal();

    this.checkQuantityEnvase(index)

    if (removeIfQuantityIs0 && this.products[index].quantity <= 0) {
      // console.log("eliminando")
      this.products.splice(index, 1);
    }
    this.sesionProducts.guardar(this.products)
    return (this.products);
  }


  addProduct(product, quantity: number | null = null): ProductSold[] {
    // console.log("Sales: add product de sales", product)
    const newPrice = product.precioVenta || 0;
    if (quantity == null && product.cantidad > 0) quantity = product.cantidad
    if (quantity == null) quantity = 1

    // if(product.idProducto == 0) {
    //si tiene id en 0 deberia ser un envase que viene de preventa
    // console.log("producto con idProducto en 0")
    // }

    const existingProductIndex = this.findKeyAndPriceAndNameInProducts(product.idProducto, product.precioVenta, product.nombre)
    if (
      !ProductSold.getInstance().esPesable(product)
      && existingProductIndex !== -1
    ) {

      // console.log("parece que ya esta agregado el producto..vamos a actualizar su cantidad")
      // console.log("cantidad actual: ", this.products[existingProductIndex].quantity, "..la nueva sera:", this.products[existingProductIndex].quantity + quantity)
      const productExistente = this.products[existingProductIndex]
      if (product.preVenta && productExistente.preVenta && product.preVenta.indexOf(productExistente.preVenta) === -1) {
        const updatedSalesData = [...this.products];
        updatedSalesData[existingProductIndex].preVenta += "," + product.preVenta
        this.products = updatedSalesData;
      }

      this.products = this.incrementQuantityByIndex(existingProductIndex, quantity, newPrice);
      this.checkQuantityEnvase(existingProductIndex, product)
    } else {
      // console.log("es un producto que no esta en la lista")
      const newProductSold = new ProductSold()
      newProductSold.fill(product)
      // newProductSold.idProducto = product.idProducto
      newProductSold.description = product.nombre
      // newProductSold.nombre = product.nombre
      newProductSold.quantity = quantity
      newProductSold.cantidad = quantity
      newProductSold.pesable = (product.tipoVenta == 2)
      // newProductSold.tipoVenta = product.tipoVenta
      newProductSold.price = newPrice
      newProductSold.key = this.products.length + 0
      // newProductSold.precioCosto = product.precioCosto
      // if (product.preVenta) {
      //   newProductSold.preVenta = product.preVenta
      //   // console.log("es preventa")
      // }
      newProductSold.updateSubtotal()
      this.products = [...this.products, newProductSold]


      //si viene con envases desde back agrego como un producto especial
      if (ProductSold.tieneEnvases(product)) {
        // console.log("tiene envase")
        const envase = new ProductSold()
        envase.idProducto = 0
        envase.description = product.envase[0].descripcion
        if (product.envase[0].cantidad !== undefined) {
          envase.quantity = product.envase[0].cantidad
        } else {
          envase.quantity = quantity
        }
        envase.pesable = false
        envase.tipoVenta = 1
        envase.ownerEnvaseId = product.idProducto
        envase.price = product.envase[0].costo
        envase.precioCosto = product.envase[0].costo
        envase.updateSubtotal()
        this.products = [...this.products, envase]

        const lastProductIndex = this.findKeyAndPriceAndNameInProducts(product.idProducto, product.precioVenta, product.nombre)
        const lastProduct = this.products[lastProductIndex]

        lastProduct.hasEnvase = true
        envase.isEnvase = true
      }
    }
    this.sesionProducts.guardar(this.products)
    return this.products;
  }

  removeFromIndex(index) {
    // console.log("removeFromIndex")
    // console.log("sales.productos", this.products)
    // console.log("index", index)

    const productoAEliminar = this.products[index];
    if (ProductSold.tieneEnvases(productoAEliminar)) {
      this.products = this.products.filter((pro_, i) => {
        return pro_.ownerEnvaseId !== productoAEliminar.idProducto
      })
    }
    this.products = this.products.filter((_, i) => i !== index)
    this.sesionProducts.guardar(this.products)
    return this.products
  }

  replaceProduct(keyProductRemove, productPut) {
    var copiaProducts: any[] = []
    this.products.forEach((prod) => {
      if (prod.key != undefined && prod.key === keyProductRemove) {
        productPut.key = keyProductRemove
        copiaProducts.push(productPut)
      } else {
        copiaProducts.push(prod)
      }
    })
    this.products = copiaProducts
    this.sesionProducts.guardar(this.products)
    
    // this.loadFromSesion()
    return this.products;
  }

  actualizarSesion() {
    const copia = System.clone(this.products)
    this.products = []
    this.products = copia
    this.sesionProducts.guardar(this.products)
  }
};


export default Sales;