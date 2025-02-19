import AsyncStorage from '@react-native-async-storage/async-storage';


class StorageSesion {

    name = "sesiondefault";
    // this.nombreBasicoParaAlmacenado = "data";
    nombreBasicoParaAlmacenado = "";
    //BASICOS

    guardados = []
    
    constructor(dataName){
        this.nombreBasicoParaAlmacenado = dataName
    }
    
    // cargarX(nombre:string):string{
    //     return localStorage.getItem(nombre) || "";
    // }

    async cargarX(nombre: string): Promise<string> {
  try {
    const valor = await AsyncStorage.getItem(nombre);
    return valor || "";
  } catch (error) {
    console.error('Error al cargar:', error);
    return "";
  }
}
async guardarX(nombre: string, valor: string): Promise<void> {
    try {
      await AsyncStorage.setItem(nombre, valor);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error; // Opcional: relanzar el error para manejo externo
    }
  }
  
  async eliminarX(nombre: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(nombre);
    } catch (error) {
      console.error('Error al eliminar:', error);
      throw error; // Opcional: relanzar el error
    }
  }
    
    // guardarX(nombre:string,valor:string) {
    //     localStorage.setItem(nombre, valor);
    // }

    // eliminarX(nombre:string) {
    //     localStorage.removeItem(nombre);
    // }
    //CON ESTRUCTURA

    //unico obligatorio es id
    
    getNombre(objeto):string{
        if(objeto.id == undefined){
            objeto.id = 1;
        }
        return this.nombreBasicoParaAlmacenado + objeto.id;
    }

    agregar(objeto) {
        var objetoGuardar = JSON.stringify(objeto);
        this.guardarX(this.getNombre(objeto),objetoGuardar);
    }

    guardar(objeto) {
        var objetoGuardar = JSON.stringify(objeto);
        this.guardarX(this.getNombre(objeto),objetoGuardar);

        this.guardados[this.getNombre(objeto)] = objeto
    }

    editar(objeto) {
        var objetoGuardar = JSON.stringify(objeto);
        this.guardarX(this.getNombre(objeto),objetoGuardar);
    }


    eliminar(objeto) {
        this.eliminarX(this.getNombre(objeto));
    }


    // cargar(objeto) {
    //     if(typeof(objeto) == "number") objeto = { id : objeto};
    //     const plain = this.cargarX(this.getNombre(objeto))
    //     try{
    //         return JSON.parse(plain);
    //     }catch(e){
    //         return null
    //     }
    // }
    async cargar(objeto: number | { id: number }): Promise<any> {
        if (typeof objeto === "number") {
            objeto = { id: objeto };
        }
        
        try {
            const plain = await this.cargarX(this.getNombre(objeto)); // ¡Agregar await!
            return JSON.parse(plain);
        } catch (e) {
            return null;
        }
    }
    // verTodos() {
    //     for(var i in localStorage) {
    //         console.log('Log storage:' + i + ' = ' + localStorage[i]);
    //     }
    // }
    async verTodos(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                console.log(`Log storage: ${key} = ${value}`);
            }
        } catch (error) {
            console.error('Error al listar storage:', error);
        }
    }
    async eliminarTodoStorage(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            for (const key of keys) {
                await AsyncStorage.removeItem(key);
                console.log(`Log storage: Eliminando.. ${key}`);
            }
        } catch (error) {
            console.error('Error al limpiar storage:', error);
        }
    }
    // eliminarTodoStorage() {
    //     for(var i in localStorage) {
    //        this.eliminarX(i); 
    //        console.log("Log storage: Eliminando.." + i);
           
    //     }
    // }

    // hasOne(){
    //     // console.log("hasOne de " + this.name);
    //     for(var i in localStorage) {
    //         if(i.indexOf(this.nombreBasicoParaAlmacenado)>-1){
    //             // console.log("devuelve true");
    //             return true;
    //         }
    //     }
    //     // console.log("devuelve false");

    //     return false;
    // }
    async hasOne(): Promise<boolean> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            return keys.some(key => key.includes(this.nombreBasicoParaAlmacenado));
        } catch (error) {
            console.error('Error verificando existencia:', error);
            return false;
        }
    }

    // getFirst(){
    //     for(var i in localStorage) {
    //         if(i.indexOf(this.nombreBasicoParaAlmacenado)>-1){
    //             var id = i.replace(this.nombreBasicoParaAlmacenado,"");
    //             var indice = this.nombreBasicoParaAlmacenado + id
    //             const leido = this.cargarX(indice)
    //             if(leido){
    //                 return JSON.parse(leido)
    //             }
    //         }
    //     }
    //     return null;
    // }
    async getFirst<T>(): Promise<T | null> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const targetKey = keys.find(key => key.includes(this.nombreBasicoParaAlmacenado));
            
            if (targetKey) {
                const id = targetKey.replace(this.nombreBasicoParaAlmacenado, '');
                const leido = await this.cargarX(this.nombreBasicoParaAlmacenado + id);
                return leido ? JSON.parse(leido) : null;
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo primer elemento:', error);
            return null;
        }
    }
    async cargarGuardados<T>(): Promise<T[]> {

        return Promise.all(this.guardados)


        try {
            const keys = await AsyncStorage.getAllKeys();
            const filteredKeys = keys.filter(key => key.includes(this.nombreBasicoParaAlmacenado));
            
            const datos = await Promise.all(
                filteredKeys.map(async (key) => {
                    try {
                        const value = await this.cargarX(key);
                        return value ? JSON.parse(value) : null;
                    } catch (e) {
                        console.log(`Error leyendo ${key}:`, e);
                        return null;
                    }
                })
            );
            
            return datos.filter(item => item !== null) as T[];
        } catch (error) {
            console.error('Error cargando guardados:', error);
            return [];
        }
    }
    // cargarGuardados() {
    //     // verTodosStorages();
    //     var indice;
    //     var datos:any[] = [];
    //     for(var i in localStorage) {
    //         if(i.indexOf(this.nombreBasicoParaAlmacenado)>-1){
    //             indice = i.replace(this.nombreBasicoParaAlmacenado,"");
    //             try{
    //                 datos.push(
    //                     JSON.parse(this.cargarX(this.nombreBasicoParaAlmacenado + indice))
    //                 );
    //             }catch(e){
    //                 console.log("sesion storage: " + this.nombreBasicoParaAlmacenado);
    //                 console.log("no se pudo leer el elemento: " + 
    //                     this.nombreBasicoParaAlmacenado + 
    //                     indice + 
    //                     " de la sesion del storage");
    //             }
    //         }
    //     }
    //     return datos;
    // }

    // truncate() {
    //     // verTodosStorages();
    //     var indice;
    //     var datos = [];
    //     for(var i in localStorage) {
    //         if(i.indexOf(this.nombreBasicoParaAlmacenado)>-1){
    //             indice = i.replace(this.nombreBasicoParaAlmacenado,"");
    //             this.eliminarX(this.nombreBasicoParaAlmacenado + indice);
    //         }
    //     }
    //     return datos;
    // }
    async truncate(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const deletePromises = keys
                .filter(key => key.includes(this.nombreBasicoParaAlmacenado))
                .map(key => AsyncStorage.removeItem(key));
            
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error truncando datos:', error);
        }
    }
    
    async calcularEspacios(): Promise<{
        limiteStorage: number;
        total: number;
        mayorId: string | null;
        mayor: number;
    }> {
        const limiteStorage = 5240370; // 5MB aproximado en caracteres
        let total = 0;
        let mayor = 0;
        let mayorId: string | null = null;
    
        try {
            const keys = await AsyncStorage.getAllKeys();
            
            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    const actual = value.length;
                    total += actual;
                    
                    if (actual > mayor) {
                        mayor = actual;
                        mayorId = key.includes(this.nombreBasicoParaAlmacenado) 
                                ? key.replace(this.nombreBasicoParaAlmacenado, '') 
                                : null;
                    }
                }
            }
            
            return {
                limiteStorage,
                total,
                mayorId,
                mayor
            };
        } catch (error) {
            console.error('Error calculando espacios:', error);
            return {
                limiteStorage,
                total: 0,
                mayorId: null,
                mayor: 0
            };
        }
    }

    // calcularEspacios() {
    //     var limiteStorage = 5240370;
    //     var resul = {},total,mayor = 0,mayorId,indice,actual,nombreEnStorage;
    //     nombreEnStorage = this.nombreBasicoParaAlmacenado;
    //     total = 0;
    //     for(var i in localStorage) {
    //         //if(this.debug)console.log(i + ' = ' + localStorage[i]);
    //         actual = localStorage[i].length;
    //         if(mayor<actual) {
    //             mayor = actual;
    //             indice = -1;

    //             if(i.indexOf(nombreEnStorage)>-1){indice = i.replace(nombreEnStorage,"");}
    //             mayorId = indice;
    //         }
    //         total = parseInt(total) + parseInt(actual);
    //     }

    //     resul = {
    //         limiteStorage:limiteStorage,
    //         total:total,
    //         mayorId:mayorId,
    //         mayor:mayor
    //     };
    //     return resul;
    // }


}


export default StorageSesion;