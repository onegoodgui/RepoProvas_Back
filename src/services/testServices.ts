import * as testRepository from '../repositories/testRepository.js'
import { errorTypes } from '../middlewares/errorHandlerMiddleware.js';


export interface Test{
    id: number,
    name: string,
    url: string,
    category: string,
    discipline: string,
    teacher: string

}

export type CreateTestData = Omit<Test, 'id'>;

export async function updateViews(id: number){

    await testRepository.updateViews(id)
}

export async function getTests(){
   return await testRepository.getTests()
}

export async function getTestById(id: number){
    const result = await testRepository.getTestById(id);

    if(!result){
        throw errorTypes.unprocessableEntityError('test id does not exist')
    }
    return
}

export async function getTeachersByDiscipline(disciplineId: number){
    return await testRepository.getTeachersByDiscipline(disciplineId)
}

export async function getCategoryId(category: string){
    const result = await testRepository.getCategoryId(category);

    if(!result){
        throw errorTypes.notFoundError('this category does not exist')
    }
    return result
}

export async function getTeacherDisciplineId(discipline:string, teacher: string){


   const result =  await testRepository.getTeacherDisciplineId(discipline, teacher);

   if(!result){
       throw errorTypes.conflictError('this discipline does not belong to this teacher')
       
   }
   return result
}

export async function testExists(test:CreateTestData, categoryId: number, teacherDisciplineId: number){

    const storedTest = await testRepository.testExists(test.name, categoryId, teacherDisciplineId);
    if(storedTest){
        throw errorTypes.conflictError('this test already exists');
    }
    else{
        return
    }
}

export async function insertTest(test: CreateTestData, categoryId: number, teacherDisciplineId: number){

    const result = await testRepository.insertTest(test, categoryId, teacherDisciplineId)
    return result
}