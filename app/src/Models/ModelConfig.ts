// import StorageSesion from '../Componentes/Helpers/StorageSesion';
// import BaseConfig from "../definitions/BaseConfig";


// class ModelConfig {
//     static instance: ModelConfig | null = null;
//     sesion: StorageSesion;

//     constructor(){
//         this.sesion = new StorageSesion("config");
//     }

//     static getInstance():ModelConfig{
//         if(ModelConfig.instance == null){
//             ModelConfig.instance = new ModelConfig();
//         }

//         return ModelConfig.instance;
//     }

//     static get(propName = ""){
//         try{
//             var rs = ModelConfig.getInstance().sesion.cargar(1)
//         }catch(err){

//         }

//         if(!rs){
//             this.getInstance().sesion.guardar(BaseConfig);
//         }
//         rs = ModelConfig.getInstance().sesion.cargar(1)

//         if(propName != ""){
//             if( rs[propName] != undefined ){
//                 return rs[propName]
//             }else{
//                 // console.log("no esta creada")
//                 rs[propName] = BaseConfig[propName]
//                 this.getInstance().sesion.guardar(rs);
//                 return rs[propName]
//             }
//         }else{
//             return BaseConfig
//         }

//         // console.log("get..")
//         // console.log(rs)
//         return rs;
//     }

//     static change(propName, propValue){
//         var all = ModelConfig.get();
//         all[propName] = propValue;
//         ModelConfig.getInstance().sesion.guardar(all); 
//     }

//     static isEqual(name, value){
//         const current = ModelConfig.get(name)
//         return current == value
//     }


//     getAll(){
//         return this.sesion.cargarGuardados();
//     }

//     getFirst(){
//         if(!this.sesion.hasOne()){
//             this.sesion.guardar(BaseConfig);
//         }
//         return(this.sesion.getFirst())
//     }

// };

// export default ModelConfig;
import StorageSesion from '../Componentes/Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";

class ModelConfig {
  static instance = null;
  sesion = null;

  constructor() {
    this.sesion = new StorageSesion("config");
  }

  static getInstance() {
    if (ModelConfig.instance === null) {
      ModelConfig.instance = new ModelConfig();
    }
    return ModelConfig.instance;
  }

  /**
   * Obtiene la configuración guardada. Si no existe, la guarda usando BaseConfig.
   * Si se especifica un propName, se retorna solo esa propiedad.
   */
  static async get(propName = "") {
    let rs;
    try {
      rs = await ModelConfig.getInstance().sesion.cargar(1);
    } catch (err) {
      console.error("Error al cargar la configuración:", err);
    }
    // Si no existe configuración, la inicializamos con BaseConfig.
    if (!rs) {
      await ModelConfig.getInstance().sesion.guardar(BaseConfig);
    }
    rs = await ModelConfig.getInstance().sesion.cargar(1);

    if (propName !== "") {
      if (rs && rs[propName] !== undefined) {
        return rs[propName];
      } else {
        // Si no existe la propiedad, la inicializamos con el valor por defecto
        rs[propName] = BaseConfig[propName];
        await ModelConfig.getInstance().sesion.guardar(rs);

        return rs[propName];
      }
    } else {
      return rs;
    }
  }

  /**
   * Cambia una propiedad de la configuración y la guarda.
   */
  static async change(propName, propValue) {
    const all = await ModelConfig.get();
    all[propName] = propValue;
    await ModelConfig.getInstance().sesion.guardar(all);
  }

  /**
   * Compara una propiedad con un valor.
   */
  static async isEqual(name, value) {
    const current = await ModelConfig.get(name);
    return current === value;
  }

  /**
   * Retorna todos los datos guardados en la sesión.
   */
  async getAll() {
    return await this.sesion.cargarGuardados();
  }

  /**
   * Retorna el primer objeto guardado en la sesión.
   * Si no existe, guarda BaseConfig y luego lo retorna.
   */
  async getFirst() {
    if (!(await this.sesion.hasOne())) {
      await this.sesion.guardar(BaseConfig);
    }
    return await this.sesion.getFirst();
  }
}

export default ModelConfig;

// ─────────────────────────────────────────────────────────────
// Bloque para ver en consola la configuración completa guardada en sesión
(async () => {
    try {
      // Asegurarse de obtener la configuración completa (no solo una propiedad)

      const modelconfigdata = new ModelConfig()
      modelconfigdata.sesion.nombreBasicoParaAlmacenado = "salesproducts"

      
      const nuevoobjeto = {

        precio : 120,
        descripcion: "cocacola",
      cantidad:44,
    }
    
    modelconfigdata.sesion.guardar(nuevoobjeto)
    
    //const products = modelconfigdata.sesion.verTodos()
const products = modelconfigdata.sesion.cargarX("salesproducts1")
     console.log("products",products);

      // modelconfigdata.sesion.truncate()
      // const config = await ModelConfig.get();
      // console.log("Configuración completa guardada:",["config",config]);
    
      // config.delayCloseWindowPrints = "123"
      // modelconfigdata.sesion.guardar(config)
      // También puedes ver todos los datos de sesión (si hay más de uno)
      // const allConfigs = await ModelConfig.getInstance().getAll();
      // console.log("Todos los datos de sesión guardadoss:", JSON.stringify(allConfigs, null, 2));
    } catch (error) {
      console.error("Error al obtener la configuración:", error);
    }
  })();


  