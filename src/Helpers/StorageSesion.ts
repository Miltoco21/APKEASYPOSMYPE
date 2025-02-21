import AsyncStorage from '@react-native-async-storage/async-storage';
import Log from 'src/Models/Log';

class StorageSesion {
  name = "sesiondefault";
  nombreBasicoParaAlmacenado = "";
  
  constructor(dataName) {
    this.nombreBasicoParaAlmacenado = dataName;
  }
  
  // Carga un valor dado el nombre de la clave
  async cargarNativo(nombre) {
    // console.log("cargarNativo de ", nombre)
    try {
      const valor = await AsyncStorage.getItem(nombre);
        // Log("valor para " +  nombre, valor)
        return Promise.resolve(JSON.parse(valor));
    } catch (error) {
      console.error('Error al cargar:', error);
      return Promise.reject("no se pudo cargar de sesion");
    }
  }
  
  // Guarda un valor dado el nombre de la clave
  async guardarNativo(nombre, valor) {
    // console.log("guardarNativo")
    // console.log("guardarNativo guardando")
    // console.log("guardarNativo nombre", nombre)
    // console.log("guardarNativo valor", valor)
    try {
      await AsyncStorage.setItem(nombre, valor)
      return Promise.resolve()
      // return Promise.resolve(rs)
    } catch (error) {
      // console.error('Error al guardar:', error);
      return Promise.reject(error)
    }
  }
  
  // Elimina una clave del AsyncStorage
  async eliminarNativo(nombre) {
    try {
      await AsyncStorage.removeItem(nombre);
      return Promise.resolve()
    } catch (error) {
      console.error('Error al eliminar:', error);
      return Promise.reject(error)
    }
  }
  
  // Retorna la clave concatenando el prefijo y el id del objeto.
  getNombre(objeto) {
    // console.log("getNombre de objeto", System.clone(objeto))
    if (objeto.id === undefined) {
      // console.log("getNombre no tiene id.. le asigno el 1")
      objeto.id = 1;
    }
    // Log("getNombre de objeto queda asi", System.clone(objeto))
    var resultado = "";
    if(objeto.id){
      resultado = this.nombreBasicoParaAlmacenado + objeto.id;
    }else{
      resultado = this.nombreBasicoParaAlmacenado + "1";
    }
    // console.log("getNombre devuelvo", resultado)
    return resultado
  }
  
  

  esResiduo(objeto){
    return(objeto._h && objeto._i && objeto._j)
  }
  
  // Guarda un objeto (es similar a agregar)
  async guardar(objeto) {
    if(this.esResiduo(objeto)){
      objeto = null
    }
    // console.log("guardar de storagesesion..objeto", objeto)
    try{
      const objetoGuardar = JSON.stringify(objeto);
      await this.guardarNativo(this.getNombre(objeto), objetoGuardar);
      // return Promise.resolve()
    }catch(e){
      // console.log("error al guardar", e)
      // return Promise.reject()
    }
    // console.log("guardar de storagesesion..objetoGuardar", objetoGuardar)
  }


  async getMaxId(){
    try {
      var mId = 0
      const keys = await AsyncStorage.getAllKeys();
      if(keys.length > 0){
        for (let key of keys) {
          if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
            let id = parseInt(key.replace(this.nombreBasicoParaAlmacenado,""))
            if(id>mId){
              mId = id
            }
          }
        }
      }
      return mId
    } catch (error) {
      console.error('Error al listar storage:', error);
    }
  }

  async getMinId(){
    try {
      var mId = 0
      const keys = await AsyncStorage.getAllKeys();
      if(keys.length > 0){
        for (let key of keys) {
          if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
            let id = parseInt(key.replace(this.nombreBasicoParaAlmacenado,""))
            if(id < mId || mId ===0){
              mId = id
            }
          }
        }
      }
      return mId
    } catch (error) {
      console.error('Error al listar storage:', error);
    }
  }


  // Agrega un objeto guardándolo en AsyncStorage
  async agregar(objeto) {
    objeto.id = await this.getMaxId() + 1
    return this.guardar(objeto)
  }
  
  // Edita un objeto guardado
  async editar(objeto) {
    if(!objeto.id){
      console.log("no se puede editar si no existe la propiedad id en el objeto", objeto)
      return
    }
    const objetoGuardar = JSON.stringify(objeto);
    await this.guardarNativo(this.getNombre(objeto), objetoGuardar);
  }
  
  // Elimina un objeto del AsyncStorage
  async eliminar(objeto) {
    await this.eliminarNativo(this.getNombre(objeto));
  }
  
  // Carga un objeto (dado su id o el objeto completo)
  async cargar(objeto) {
    if (typeof objeto === "number") objeto = { id: objeto };
    try {
      const loaded = await this.cargarNativo(this.getNombre(objeto))
        return loaded
    } catch (e) {
      // console.log("e", e)
      return "error"
    }
  }
  
  // Muestra en consola todas las claves y sus valores
  async verTodos() {
    console.log("verTodos")
    try {
      const keys = await AsyncStorage.getAllKeys();
      if(keys.length > 0){
        console.log("keys", keys)
        for (let key of keys) {
          console.log("key", key)
          const value = await this.cargarNativo(key);
          Log(`Log storage: ${key}`, value);
        }
      }else{
        console.log("no hay nada en la sesion")
      }
    } catch (error) {
      console.error('Error al listar storage:', error);
    }
  }
  
  // Elimina todas las claves almacenadas
  async eliminarTodoSesion() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        await this.eliminarNativo(key);
        // console.log("Log storage: Eliminando.. " + key);
      }
    } catch (error) {
      // console.error('Error al limpiar storage:', error);
    }
  }
  
  // Verifica si existe al menos una clave con el prefijo
  async hasOne() {
    // console.log("hasOne")
    try {
      const keys = await AsyncStorage.getAllKeys();
      var found = false
      for (let key of keys) {
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          found = true
        }
      }
      // console.log("hasOne..devuelve", found)
      return found;
    } catch (error) {
      // console.error('Error verificando existencia:', error);
      // console.log("hasOne..devuelve", false)
      return false;
    }
  }

  //carga el primero que encuentra
  async getOne() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      var found = null
      for (let key of keys) {
        // console.log("->key", key)
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          found = await this.cargarNativo(key)
          break
        }
      }
      // console.log("hasOne..devuelve", found)
      return found;
    } catch (error) {
      // console.error('Error verificando existencia:', error);
      // console.log("hasOne..devuelve", false)
      return false;
    }
  }
  
  // Retorna el primer objeto encontrado con el prefijo
  async getFirst() {
    try {
      const minId = await this.getMinId()
      const primero = await this.cargar(minId);
      return primero;
    } catch (error) {
      console.error('Error en getFirst:', error);
      return null;
    }
  }
  
  // Carga todos los objetos guardados que tengan el prefijo
  async cargarGuardados() {
    // console.log("cargarGuardados")
    let datos = [];
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          let indice = key.replace(this.nombreBasicoParaAlmacenado, "");
          try {
            const valor = await this.cargarNativo(this.nombreBasicoParaAlmacenado + indice);
            // datos.push(JSON.parse(valor));
            datos.push(valor);
          } catch (e) {
            console.log("sesion storage: " + this.nombreBasicoParaAlmacenado);
            console.log(
              "no se pudo leer el elemento: " +
                this.nombreBasicoParaAlmacenado +
                indice +
                " de la sesion del storage"
            );
          }
        }
      }
      return datos;
    } catch (error) {
      console.error('Error en cargarGuardados:', error);
      return datos;
    }
  }
  
  // Elimina todas las claves que tengan el prefijo
  async truncate() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          let indice = key.replace(this.nombreBasicoParaAlmacenado, "");
          await this.eliminarNativo(this.nombreBasicoParaAlmacenado + indice);
        }
      }
    } catch (error) {
      console.error('Error en truncate:', error);
    }
  }
  
  // Calcula el espacio utilizado por los datos almacenados
  async calcularEspacios() {
    //solo para web
    return 1
  }
}

export default StorageSesion;
