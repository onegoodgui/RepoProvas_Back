
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import * as authRepository from '../repositories/authRepository.js'
import { errorTypes } from "../middlewares/errorHandlerMiddleware.js";

export interface JwtPayload {
    sessionId: number
  }

export async function validateToken(req: Request, res: Response, next: NextFunction){

    console.log(req.headers.authorization);
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    const data = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    if(!data ){
        throw errorTypes.unauthorizedError();
    }
    console.log(data)
    const result = await authRepository.findUserBySessionId(data);
    if(result){
        next()
    }
    else{
        throw errorTypes.unauthorizedError();
    }
}