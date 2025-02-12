import StorageSesion from '../Componentes/Helpers/StorageSesion';
import BaseConfig from "../definitions/BaseConfig";
import axios from "axios";
import Model from './Model';
import { useState } from 'react';
import ModelConfig from './ModelConfig.ts';
import EndPoint from './EndPoint.ts';


class Balanza{

  static codigoConfig = null

  constructor(){
    this.sesion = new StorageSesion("balanza");
  }

  static getInstance(){
    if(Balanza.instance == null){
        Balanza.instance = new Balanza();
    }

    return Balanza.instance;
  }

  static getCodigo(){
    if(this.codigoConfig === null){
      this.codigoConfig = ModelConfig.get("codBalanza")
    }

    return this.codigoConfig
  }

  static contieneCodigo(valor){
    return (valor.indexOf(this.codigoConfig)>-1)
  }
};

export default Balanza;