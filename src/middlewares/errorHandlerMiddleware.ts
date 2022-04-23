import { Request, Response, NextFunction} from "express";

interface ErrorType{
  type: string,
  message?: string
}

const serviceErrorToStatusCode = {
    unauthorized: 401,
    notFound: 404,
    conflict: 409,
    unprocessableEntity: 422
  };
  
  function unauthorizedError(customMessage?:string) {
    return { type: "unauthorized", message: customMessage ? customMessage : 'Unautohrized' };
  }
  
  function conflictError(customMessage?:string) {
    return { type: "conflict", message: customMessage ? customMessage : 'Conflict' };
  }

  function notFoundError(customMessage?: string){
    return {type: 'notFound', message: customMessage ? customMessage : 'Not found'}
  }

  function unprocessableEntityError(){
    return {type: 'unprocessableEntity', message:'Unprocessable Entity'}
  }

  export default function handleErrorsMiddleware(err:ErrorType, req:Request, res:Response, next:NextFunction) {
    if (err.type) {
     return res.status(serviceErrorToStatusCode[err.type]).send(err.message);
    }
  
    res.sendStatus(500);
  }

  export const errorTypes = {
    unauthorizedError,
    conflictError,
    notFoundError,
    unprocessableEntityError
  }