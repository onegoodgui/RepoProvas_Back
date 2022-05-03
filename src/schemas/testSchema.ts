import joi from "joi";
import { CreateTestData } from "../services/testServices";

export const testSchema = joi.object<CreateTestData>({
    name: joi.string().required(),
    url: joi.string().uri().regex(/.pdf$/).required(),
    category: joi.string().required(),
    discipline: joi.string().required(),
    teacher: joi.string().required()
})
