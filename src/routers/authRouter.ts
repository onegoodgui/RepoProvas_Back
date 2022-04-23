import { Router } from "express";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleare.js";
import { authSchema } from "../schemas/authSchema.js";
import { SignUp, SignIn } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post('/sign-up', validateSchemaMiddleware(authSchema), SignUp)
authRouter.post('/sign-in', validateSchemaMiddleware(authSchema), SignIn)

export default authRouter