import { Request, Response, NextFunction } from "express";
import * as testServices from '../services/testServices.js'
import { CreateTestData } from "../services/testServices.js";

export async function updateViews(req:Request, res: Response){

    const {id} = req.params

    await testServices.getTestById(parseInt(id));
    await testServices.updateViews(parseInt(id));
    res.sendStatus(200)
}

export async function getTests(req: Request, res: Response){
    const results = await testServices.getTests();
    res.send(results).status(201)
}

export async function getTeachersByDiscipline(req: Request, res: Response){
    const {disciplineId} = req.params;
    const results = await testServices.getTeachersByDiscipline(parseInt(disciplineId));
    res.send(results).status(201);
}

export async function addTest(req:Request, res: Response){

    const test = req.body as CreateTestData ;

    const {id: categoryId} = await testServices.getCategoryId(test.category);
    const {id: teacherDisciplineId} = await testServices.getTeacherDisciplineId(test.discipline, test.teacher);

    await testServices.testExists(test, categoryId, teacherDisciplineId);
    await testServices.insertTest(test, categoryId, teacherDisciplineId);
    
    res.sendStatus(201);
}
