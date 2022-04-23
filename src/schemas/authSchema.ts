import joi from 'joi'
import { CreateUserData } from '../services/authServices.js'

export const authSchema = joi.object<CreateUserData>({
    email: joi.string().email().required(),
    password: joi.string().required()
})