import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";


class ModelConfig {
    static instance: ModelConfig | null = null;
    sesion: StorageSesion;

    constructor() {
        this.sesion = new StorageSesion("config");
    }

    static getInstance(): ModelConfig {
        if (ModelConfig.instance == null) {
            ModelConfig.instance = new ModelConfig();
        }

        return ModelConfig.instance;
    }

    static async get(propName = "") {
        // console.log("get para ", propName)
        var rs = null
        try {
            rs = await ModelConfig.getInstance().sesion.cargar(1)
            if (!rs || typeof (rs) != "object") throw Error("lo que cargo de sesion no es un objeto")
            // console.log("carga de sesion", rs)
            if (propName != "") {
                if (rs[propName] != undefined) {
                    // console.log("devuelve 1 de get ", rs[propName])
                    return rs[propName]
                } else {
                    // console.log("no esta creada")
                    rs[propName] = BaseConfig[propName]
                    this.getInstance().sesion.guardar(rs);

                    // console.log("devuelve 2 de get ", rs[propName])
                    return rs[propName]
                }
            } else {

                // console.log("devuelve 3 de get ", rs)
                return rs
            }

        } catch (err) {
            // console.log("catch ", err)

            await this.getInstance().sesion.guardar(BaseConfig);

            if (propName != "") {
                // console.log("devuelve 4 de get ")
                // console.log(BaseConfig[propName])
                return BaseConfig[propName]
            } else {
                // console.log("devuelve 5 de get ")
                // console.log(BaseConfig)
                return BaseConfig
            }
        }


    }

    static change(propName, propValue) {
        var all = ModelConfig.get();
        all[propName] = propValue;
        ModelConfig.getInstance().sesion.guardar(all);
    }

    static isEqual(name, value) {
        const current = ModelConfig.get(name)
        return current == value
    }


    getAll() {
        return this.sesion.cargarGuardados();
    }

    getFirst() {
        if (!this.sesion.hasOne()) {
            this.sesion.guardar(BaseConfig);
        }
        return (this.sesion.getFirst())
    }

};

export default ModelConfig;