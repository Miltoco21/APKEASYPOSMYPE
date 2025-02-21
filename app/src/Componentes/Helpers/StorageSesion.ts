import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageSesion {
  name = "sesiondefault";
  nombreBasicoParaAlmacenado = "";
  
  constructor(dataName) {
    this.nombreBasicoParaAlmacenado = dataName;
  }
  
  // Carga un valor dado el nombre de la clave
  async cargarX(nombre) {

    console.log("nombre",nombre)
    const keys = await AsyncStorage.getAllKeys();
    // console.log("keys",keys);
    // console.log("clavencontarda",keys.includes(nombre));
    // for (let key of keys) {
    //   const value = await AsyncStorage.getItem(key);
    //   // console.log(`Log storage: ${key} = ${value}`);
    // }
    
    try {
      const valor = await AsyncStorage.getItem(nombre);
      console.log("valor",valor);
      
      return valor || "";
    } catch (error) {
      console.error('Error al cargar:', error);
      return "";
    }
  }
  
  // Guarda un valor dado el nombre de la clave
  async guardarX(nombre, valor) {
    try {
      await AsyncStorage.setItem(nombre, valor);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
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
    if (objeto.id === undefined) {
      objeto.id = 1;
    }
    return this.nombreBasicoParaAlmacenado + objeto.id;
  }
  
  // Agrega un objeto guardándolo en AsyncStorage
  async agregar(objeto) {
    const objetoGuardar = JSON.stringify(objeto);
    await this.guardarX(this.getNombre(objeto), objetoGuardar);
  }
  
  // Guarda un objeto (es similar a agregar)
  async guardar(objeto) {
    const objetoGuardar = JSON.stringify(objeto);
    await this.guardarX(this.getNombre(objeto), objetoGuardar);
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
      const plain = await this.cargarX(this.getNombre(objeto));
      return JSON.parse(plain);
    } catch (e) {
      return null;
    }
  }
  
  // Muestra en consola todas las claves y sus valores
  async verTodos() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`Log storage: ${key} = ${value}`);
      }
    } catch (error) {
      console.error('Error al listar storage:', error);
    }
  }
  
  // Elimina todas las claves almacenadas
  async eliminarTodoStorage() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        await AsyncStorage.removeItem(key);
        console.log("Log storage: Eliminando.. " + key);
      }
    } catch (error) {
      console.error('Error al limpiar storage:', error);
    }
  }
  
  // Verifica si existe al menos una clave con el prefijo
  async hasOne() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error verificando existencia:', error);
      return false;
    }
  }
  
  // Retorna el primer objeto encontrado con el prefijo
  async getFirst() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        if (key.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
          let id = key.replace(this.nombreBasicoParaAlmacenado, "");
          let indice = this.nombreBasicoParaAlmacenado + id;
          const leido = await this.cargarX(indice);
          if (leido) {
            return JSON.parse(leido);
          }
        }
      }
      return null;
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
            datos.push(JSON.parse(valor));
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
