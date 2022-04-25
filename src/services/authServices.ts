import { User } from "../controllers/authController.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as authRepository from '../repositories/authRepository.js'
import { errorTypes } from "../middlewares/errorHandlerMiddleware.js";

export type CreateUserData = Omit<User, "id">;
export type LoginUserData = Omit<User, "id">;
import type { Email } from "../repositories/authRepository.js";



export async function persistUserData(user:CreateUserData){
    const {email} = user;
    const hashedPassword = bcrypt.hashSync(user.password, 10);

    return await authRepository.insertUserData({email, password:hashedPassword});
}



export async function emailAlreadyExists(email: Email){

    const result =  await authRepository.findUserByEmail(email);

    if(result){
        throw errorTypes.conflictError('e-mail já cadastrado');
    }

    return
}

export async function confirmPassword(user:LoginUserData){

    const userData = await authRepository.findUserByEmail({email: user.email});
    if(bcrypt.compareSync(user.password, userData.password)){
        return userData
    }
    else{
        throw errorTypes.unauthorizedError('senha inválida');
    }
}

export async function createSession(user: User){

    const sessionData = await authRepository.createSession(user);
    const data = {sessionId: sessionData.id};
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(data, secretKey);

    return token

}

