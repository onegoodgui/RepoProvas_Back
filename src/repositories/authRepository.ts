import { client } from "../database.js";
import { CreateUserData } from "../services/authServices.js";
import { User } from "../controllers/authController.js";

export type Email = Omit<CreateUserData, 'password'>

export async function insertUserData(user: CreateUserData){

const {email, password} = user;
    return await client.users.create({data:
        {email, password}
    })
}

export async function findUserByEmail(object: Email){

    return await client.users.findFirst({
        where:{
            email: object.email
        }
    })
}

export async function createSession(user:User){
    return await client.sessions.create({data:
        {userId: user.id}
    })
}