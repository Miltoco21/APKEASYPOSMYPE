import StorageSesion from '../Helpers/StorageSesion';
import IProduct from '../Types/IProduct';
import Model from './Model';
import BaseConfig from "../definitions/BaseConfig";
import axios from 'axios';
import ModelConfig from './ModelConfig';
import EndPoint from './EndPoint';


class Product extends Model implements IProduct  {

    idProducto: number
    description: string | null
    nombre: string | null
    price: number | undefined
    priceVenta: number | undefined

    precioCosto: string | null | undefined;

    static enviando = false

    static instance: Product | null = null;
    static getInstance():Product{
        if(Product.instance == null){
            Product.instance = new Product();
        }

        return Product.instance;
    }

    static logicaRedondeoUltimoDigito(valor){
        const totalStr = valor + ""
        const ultTotalStr = totalStr.substring(totalStr.length-1,totalStr.length)
        // console.log("totalStr", totalStr)
        // console.log("ultTotalStr", ultTotalStr)
        if(parseInt(ultTotalStr)  == 0) return (0)
        if(parseInt(ultTotalStr)<=5){
          return (-1 * parseInt(ultTotalStr))
        }else{
          return( 10 - parseInt(ultTotalStr))
        }
    }

    //para redondear el vuelto por ejemplo
    static logicaInversaRedondeoUltimoDigito(valor){
        const totalStr = valor + ""
        const ultTotalStr = totalStr.substring(totalStr.length-1,totalStr.length)
        // console.log("totalStr", totalStr)
        // console.log("ultTotalStr", ultTotalStr)
        if(parseInt(ultTotalStr)  == 0) return (0)
        if(parseInt(ultTotalStr)<=4){
          return (-1 * parseInt(ultTotalStr))
        }else{
          return( 10 - parseInt(ultTotalStr))
        }
    }

    async findByDescription({description, codigoCliente},callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase +
        "/api/ProductosTmp/GetProductosByDescripcion?descripcion=" + (description+"")
        if(codigoCliente){
            url += "&codigoCliente=" + codigoCliente
        }
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(response.data.productos, response);
        },callbackWrong)   
    }

    async findByDescriptionPaginado({
        description,
        codigoCliente,
        canPorPagina = 10,
        pagina = 1
    },callbackOk, callbackWrong){
        var url = await ModelConfig.get("urlBase") +
        "/api/ProductosTmp/GetProductosByDescripcionPaginado?descripcion=" + (description+"")
        if(codigoCliente){
            url += "&codigoCliente=" + codigoCliente
        }
        url += "&pageNumber=" + pagina
        url += "&rowPage=" + canPorPagina
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(response.data.productos, response);
        },callbackWrong)
    }

    async findPreVenta(data,callbackOk, callbackWrong){
        if(Product.enviando) return

        Product.enviando = true
        const configs = ModelConfig.get()
        var url = configs.urlBase
        url += "/api/Ventas/PreVentaGET"
        
        if(!data.codigoSucursal) data.codigoSucursal = ModelConfig.get("sucursal")
        if(!data.puntoVenta) data.puntoVenta = ModelConfig.get("puntoVenta")


        EndPoint.sendPost(url,data,(responseData, response)=>{
            if(response.data.preventa.length > 0){
                callbackOk(response.data.preventa[0].products, response.data);
            }else{
                callbackWrong("respuesta incorrecta del servidor") 
            }
            Product.enviando = false
        },(err)=>{
            Product.enviando = false
            callbackWrong(err)
        })  
    }

    async findByCodigo({codigoProducto, codigoCliente},callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase +
        "/api/ProductosTmp/GetProductosByCodigo?idproducto=" + codigoProducto
        if(codigoCliente){
            url += "&codigoCliente=" + codigoCliente
        }

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")


        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(response.data.productos, response);
        },callbackWrong)
    }

    async findByCodigoBarras({codigoProducto, codigoCliente},callbackOk, callbackWrong){
        if(Product.enviando) return
        
        Product.enviando = true

        const configs = ModelConfig.get()
        var url = configs.urlBase +
        "/api/ProductosTmp/GetProductosByCodigoBarra?codbarra=" + codigoProducto
        if(codigoCliente){
            url += "&codigoCliente=" + codigoCliente
        }

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(responseData.productos, response);
            Product.enviando = false
        },(a,b,c)=>{
            Product.enviando = false
            if(callbackWrong)callbackWrong(a,b,c)
        })
    }


    async getCategories(callbackOk, callbackWrong) {
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/NivelMercadoLogicos/GetAllCategorias"
        
        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        
        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(response.data.categorias, response);
        },callbackWrong)
    }


    async getSubCategories(categoriaId, callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=" + categoriaId
        
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
        const response = await axios.get(
            url
        );
        
        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(responseData.subCategorias, response);
        },callbackWrong)
            
      }

      
    async getFamiliaBySubCat({
        categoryId,
        subcategoryId
    }, callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?" +
        "CategoriaID=" + categoryId +
        "&SubCategoriaID=" + subcategoryId

        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        
        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(responseData.familias, response);
        },callbackWrong)
    }

    async getSubFamilia({
        categoryId,
        subcategoryId,
        familyId
    }, callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        +"/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?" + 
        "CategoriaID=" + categoryId +
        "&SubCategoriaID=" + subcategoryId +
        "&FamiliaID=" + familyId
        
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
        
        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(response.data.subFamilias, response);
        },callbackWrong)
    }

    async getProductsNML({
        catId,
        subcatId,
        famId,
        subFamId
    }, callbackOk, callbackWrong){

        if(!catId) catId = 1
        if(!subcatId) subcatId = 1

        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/ProductosTmp/GetProductosByIdNML?idcategoria=" + catId
        + "&idsubcategoria=" + subcatId
        + "&idfamilia=" + famId
        + "&idsubfamilia=" + subFamId
        url += "&codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
        
        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(responseData.productos, response);
        },callbackWrong)
    }


    async getProductsFastSearch(callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/ProductosTmp/ProductosVentaRapidaGet"
        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")
        

        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(responseData.productosVentaRapidas, response);
        },callbackWrong)
    }

    async addProductFastSearch(product,callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase + "/api/ProductosTmp/ProductosVentaRapidaPost"
        
        if(!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if(!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")
        
        EndPoint.sendPost(url,product,(responseData, response)=>{
            callbackOk(responseData,response);
        },callbackWrong)
    }

    async changeProductFastSearch(product,callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/ProductosTmp/ProductosVentaRapidaPut"
        
        if(!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if(!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")
        EndPoint.sendPut(url,product,(responseData, response)=>{
            callbackOk(responseData,response);
        },callbackWrong)
    }

    async removeProductFastSearch(product,callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/ProductosTmp/ProductosVentaRapidaDelete"
        
        if(!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if(!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")
        
        EndPoint.sendDelete(url,{
            params: product
        },(responseData, response)=>{
            callbackOk(responseData,response);
        },callbackWrong)
    }
    
    async assignPrice(product,callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/ProductosTmp/UpdateProductoPrecio"

        if(!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if(!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")
        
        EndPoint.sendPut(url,product,(responseData, response)=>{
            callbackOk(responseData,response);
        },callbackWrong)
            
    }
    
    async newProductFromCode(product,callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/ProductosTmp/AddProductoNoEncontrado"

        if(!product.codigoSucursal) product.codigoSucursal = ModelConfig.get("sucursal")
        if(!product.puntoVenta) product.puntoVenta = ModelConfig.get("puntoVenta")
        
        EndPoint.sendPost(url,product,(responseData, response)=>{
            callbackOk(responseData,response);
        },callbackWrong)
    }

    async getTipos(callbackOk, callbackWrong){
        const configs = ModelConfig.get()
        var url = configs.urlBase
        + "/api/ProductosTmp/GetProductoTipos"
        url += "?codigoSucursal=" + ModelConfig.get("sucursal")
        url += "&puntoVenta=" + ModelConfig.get("puntoVenta")

        
        
        EndPoint.sendGet(url,(responseData, response)=>{
            callbackOk(responseData.productoTipos,response);
        },callbackWrong)
    }

};



export default Product;