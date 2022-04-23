import { Request, Response, NextFunction } from "express"
import { errorTypes } from "../middlewares/errorHandlerMiddleware.js";
import * as authServices from '../services/authServices.js'


export interface User{
    id: number,
    email: string,
    password: string
}


export async function SignUp(req:Request, res:Response){

    const {email, password} = req.body;

    if(!email || !password){
        throw errorTypes.unprocessableEntityError()
    }

    await authServices.emailAlreadyExists({email});
    await authServices.persistUserData({email, password});

    res.sendStatus(200);

}

export async function SignIn(req: Request, res:Response){

    const {email, password} = req.body;

    if(!email || !password){
        throw errorTypes.unprocessableEntityError()
    }

    const user = await authServices.confirmPassword({email, password});
    const token = await authServices.createSession(user);

    res.send({token}).status(201);
}