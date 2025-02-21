import AsyncStorage from '@react-native-async-storage/async-storage';
import System from './System';
import Log from 'Models/Log';

class StorageSesion {
  name = "sesiondefault";
  nombreBasicoParaAlmacenado = "";
  
  constructor(dataName) {
    this.nombreBasicoParaAlmacenado = dataName;
  }
  
  // Carga un valor dado el nombre de la clave
  async cargarX(nombre) {
    // console.log("cargarX de ", nombre)
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
  async guardarX(nombre, valor) {
    // console.log("guardarX")
    // console.log("guardarX guardando")
    // console.log("guardarX nombre", nombre)
    // console.log("guardarX valor", valor)
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
  async eliminarX(nombre) {
    try {
      await AsyncStorage.removeItem(nombre);
    } catch (error) {
      console.error('Error al eliminar:', error);
      throw error;
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
  
  // Agrega un objeto guardándolo en AsyncStorage
  async agregar(objeto) {
    const objetoGuardar = JSON.stringify(objeto);
    await this.guardarX(this.getNombre(objeto), objetoGuardar);
  }
  
  // Guarda un objeto (es similar a agregar)
  async guardar(objeto) {
    if(objeto._h && objeto._i && objeto._j){
      objeto = null
    }
    // console.log("guardar de storagesesion..objeto", objeto)
    try{
      const objetoGuardar = JSON.stringify(objeto);
      await this.guardarX(this.getNombre(objeto), objetoGuardar);
      // return Promise.resolve()
    }catch(e){
      // console.log("error al guardar", e)
      // return Promise.reject()
    }
    // console.log("guardar de storagesesion..objetoGuardar", objetoGuardar)
  }
  
  // Edita un objeto guardado
  async editar(objeto) {
    const objetoGuardar = JSON.stringify(objeto);
    await this.guardarX(this.getNombre(objeto), objetoGuardar);
  }
  
  // Elimina un objeto del AsyncStorage
  async eliminar(objeto) {
    await this.eliminarX(this.getNombre(objeto));
  }
  
  // Carga un objeto (dado su id o el objeto completo)
  async cargar(objeto) {
    if (typeof objeto === "number") objeto = { id: objeto };
    try {
      const loaded = await this.cargarX(this.getNombre(objeto))
        return loaded
    } catch (e) {
      // console.log("e", e)
      return "error"
    }
  }
  
  // Muestra en consola todas las claves y sus valores
  async verTodos() {
    // console.log("verTodos")
    try {
      const keys = await AsyncStorage.getAllKeys();
      // console.log("keys", keys)
      for (let key of keys) {
        const value = await AsyncStorage.getItem(key);
        // console.log(`Log storage: ${key} = ${value}`);
      }
    } catch (error) {
      // console.error('Error al listar storage:', error);
    }
  }
  
  // Elimina todas las claves almacenadas
  async eliminarTodoStorage() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        await AsyncStorage.removeItem(key);
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
  
  // Retorna el primer objeto encontrado con el prefijo
  async getFirst() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      var encontrado = null
      for (let key of keys) {
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          // console.log("coincide la key..",this.nombreBasicoParaAlmacenado)
          let id = key.replace(this.nombreBasicoParaAlmacenado, "");
          let indice = this.nombreBasicoParaAlmacenado + id;
          const leido = await this.cargarX(indice);
          encontrado = leido
          // if (leido) {
          //   return JSON.parse(leido);
          // }
        }
      }
      return encontrado;
    } catch (error) {
      console.error('Error en getFirst:', error);
      return null;
    }
  }
  
  // Carga todos los objetos guardados que tengan el prefijo
  async cargarGuardados() {
    let datos = [];
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          let indice = key.replace(this.nombreBasicoParaAlmacenado, "");
          try {
            const valor = await this.cargarX(this.nombreBasicoParaAlmacenado + indice);
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
          await this.eliminarX(this.nombreBasicoParaAlmacenado + indice);
        }
      }
    } catch (error) {
      console.error('Error en truncate:', error);
    }
  }
  
  // Calcula el espacio utilizado por los datos almacenados
  async calcularEspacios() {
    const limiteStorage = 5240370; // Aproximadamente 5MB en caracteres
    let total = 0;
    let mayor = 0;
    let mayorId = null;
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          let actual = value.length;
          total += actual;
          if (actual > mayor) {
            mayor = actual;
            mayorId =
              key.indexOf(this.nombreBasicoParaAlmacenado) > -1
                ? key.replace(this.nombreBasicoParaAlmacenado, "")
                : null;
          }
        }
      }
      return {
        limiteStorage,
        total,
        mayorId,
        mayor,
      };
    } catch (error) {
      console.error('Error en calcularEspacios:', error);
      return {
        limiteStorage,
        total: 0,
        mayorId: null,
        mayor: 0,
      };
    }
  }
}

export default StorageSesion;
