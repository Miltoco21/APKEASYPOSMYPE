import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";

// Interface para tipado fuerte (agrega todas las propiedades necesarias)
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

    static async get(propName = ""): Promise<any> {
        // console.log("haciendo get para propName", propName)
        try {
            const rs: any = await ModelConfig.getInstance().sesion.cargar(1);
            
            if (!rs || typeof rs !== "object") {
                throw new Error("Lo cargado desde sesión no es un objeto");
            }

            if (propName !== "") {
                if (rs[propName] !== undefined) {
                    // console.log("devuelvo desde sesion ", rs[propName])
                    return rs[propName];
                } else {
                    // Asegurar que la propiedad existe en BaseConfig
                    if (propName in BaseConfig) {
                        rs[propName] = BaseConfig[propName];
                        await this.getInstance().sesion.guardar(rs);

                        // console.log("devuelvo desde default", rs[propName])
                        return rs[propName];
                    }
                    throw new Error(`Propiedad ${propName} no existe en la configuración`);
                }
            }

            // console.log("devuelvo todo de la sesion ", rs)
            return rs;

        } catch (err) {
            await this.getInstance().sesion.guardar(BaseConfig);

            // console.log("devuelvo desde default 2 ", propName !== "" ? BaseConfig[propName] : BaseConfig)

            return propName !== "" ? BaseConfig[propName] : BaseConfig;
        }
    }

    static async change(propName: any, propValue: any): Promise<void> {
        const all: any = await ModelConfig.get();
        all[propName] = propValue;
        await ModelConfig.getInstance().sesion.guardar(all);
    }

    static async isEqual(name: any, value: any): Promise<boolean> {
        const current = await ModelConfig.get(name);
        return current === value;
    }

    // Métodos adicionales mejorados
    async getAll(): Promise<any[]> {
        return await this.sesion.cargarGuardados();
    }

    getFirst(): any {
        if (!this.sesion.hasOne()) {
            this.sesion.guardar(BaseConfig);
        }
        return this.sesion.getFirst();
    }
}

export default ModelConfig;