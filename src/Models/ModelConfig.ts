import StorageSesion from '../Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";

// Interface para tipado fuerte (agrega todas las propiedades necesarias)
interface Config {
  [key: string]: any;
  emitirBoleta?: boolean;
  tienePasarelaPago?: boolean;
  urlBase?: string;
}

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

    static async get(propName: keyof Config = ""): Promise<any> {
        try {
            const rs: Config = await ModelConfig.getInstance().sesion.cargar(1);
            
            if (!rs || typeof rs !== "object") {
                throw new Error("Lo cargado desde sesión no es un objeto");
            }

            if (propName !== "") {
                if (rs[propName] !== undefined) {
                    return rs[propName];
                } else {
                    // Asegurar que la propiedad existe en BaseConfig
                    if (propName in BaseConfig) {
                        rs[propName] = BaseConfig[propName];
                        await this.getInstance().sesion.guardar(rs);
                        return rs[propName];
                    }
                    throw new Error(`Propiedad ${propName} no existe en la configuración`);
                }
            }
            return rs;

        } catch (err) {
            await this.getInstance().sesion.guardar(BaseConfig);
            return propName !== "" ? BaseConfig[propName] : BaseConfig;
        }
    }

    static async change(propName: keyof Config, propValue: any): Promise<void> {
        const all: Config = await ModelConfig.get();
        all[propName] = propValue;
        await ModelConfig.getInstance().sesion.guardar(all);
    }

    static async isEqual(name: keyof Config, value: any): Promise<boolean> {
        const current = await ModelConfig.get(name);
        return current === value;
    }

    // Métodos adicionales mejorados
    async getAll(): Promise<Config[]> {
        return await this.sesion.cargarGuardados();
    }

    getFirst(): Config {
        if (!this.sesion.hasOne()) {
            this.sesion.guardar(BaseConfig);
        }
        return this.sesion.getFirst();
    }
}

export default ModelConfig;