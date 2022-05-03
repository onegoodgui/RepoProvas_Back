import { Router } from "express";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleare.js";
import { updateViews, getTests, getTeachersByDiscipline, addTest } from "../controllers/testController.js";
import { testSchema } from "../schemas/testSchema.js";


const testRouter = Router();

testRouter.patch('/tests/:id', validateToken, updateViews);
testRouter.get('/tests', validateToken, getTests);
testRouter.get('/tests/discipline/:disciplineId/teachers', validateToken, getTeachersByDiscipline)
testRouter.post('/tests', validateSchemaMiddleware(testSchema) ,validateToken, addTest)

export default testRouter