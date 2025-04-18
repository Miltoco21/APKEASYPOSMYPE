import axios from 'axios';
import Singleton from './Singleton';
import SoporteTicket from './SoporteTicket';
import Log from './Log';


class EndPoint extends Singleton {

  static admError(error,callbackWrong){
    Log("admError", error)
    console.log("admError2", callbackWrong)
    SoporteTicket.catchRequestError(error)
    if(callbackWrong == undefined) return
    if (error.response) {
      if (error.response.data && error.response.data.descripcion) {
        callbackWrong(error.response.data.descripcion, error.response);
      }else if (error.response.status === 500) {
        callbackWrong("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.", error.response);
      }else{
        callbackWrong(error.message, error.response);
      }
    } else if (error.data && error.data.descripcion){
      callbackWrong(error.data.descripcion, error);
    } else if(error.message != ""){
      callbackWrong(error.message, error)
    }else {
      callbackWrong("Error de comunicacion con el servidor", error);
    }
  }
  
  static async sendGet(url, callbackOk, callbackWrong){
    try{
      const response = await axios.get(url);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        if(callbackOk != undefined) callbackOk(response.data, response)
      }else{
        var msgError = "Error de servidor"
        callbackWrong(response.data.descripcion);
        if(response.data && response.data.descripcion) msgError = response.data.descripcion
        if(callbackWrong != undefined) callbackWrong(msgError)
        SoporteTicket.catchRequest(response)
      }
    }catch(error){
      this.admError(error,callbackWrong)
    }
  }


  static async sendPost(url, data, callbackOk, callbackWrong){
    try{
      const response = await axios.post(url,data);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        if(callbackOk != undefined) callbackOk(response.data, response)
      }else{
        this.admError(response,callbackWrong)
        // if(callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    }catch(error){
      this.admError(error,callbackWrong)
    }
  }

  static async sendPut(url, data, callbackOk, callbackWrong){
    try{
      const response = await axios.put(url,data);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        if(callbackOk != undefined) callbackOk(response.data, response)
      }else{
        if(callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    }catch(error){
      this.admError(error,callbackWrong)
    }
  }

  static async sendDelete(url, data, callbackOk, callbackWrong){
    try{
      const response = await axios.delete(url,data);
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        if(callbackOk != undefined) callbackOk(response.data, response)
      }else{
        if(callbackWrong != undefined) callbackWrong("Error de servidor")
        SoporteTicket.catchRequest(response)
      }
    }catch(error){
      this.admError(error,callbackWrong)
    }
  }
};

export default EndPoint;