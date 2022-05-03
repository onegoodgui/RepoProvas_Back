import { client } from "../../src/database";
import faker from "@faker-js/faker";
import { createDiscipline } from "./filterFactory";
import { disciplines, teachers } from "@prisma/client";

export async function createTeacher(){

    const teacher = await client.teachers.create({
        data:{
            name: 'Alberto',
        }
    })

    return teacher
}

export async function createTeacherByName(teacher: string){

    const result = await client.teachers.create({
        data:{
            name: teacher,
        }
    })

    return result
}

export async function createDisciplineByName(discipline:string) {

    const {id: termId} = await client.terms.findFirst({
        where:{
            number: 1,
        }
    })

    const result = await client.disciplines.create({
        data:{
            name: discipline,
            termId: termId
        }
    })

    return result
}

export async  function createAndInsertTest(){
    const name = '2020/1'
    const pdf = 'https://educapes.capes.gov.br/retrieve/166324/eBook_Equacoes_Diferenciais-Licenciatura_Matematica_UFBA.pdf'

    const teacher = await createTeacher();
    const discipline = await createDiscipline();

    const {id: teacherDisciplineId} = await client.teachersDisciplines.create({
        data:{
            teacherId: teacher.id,
            disciplineId: discipline.id
        }
    })

    const {id: categoryId} = await client.categories.findFirst({
        where:{
            name:'P1'
        }
    })

    const {id} = await client.tests.create({
        data:{
            name: name,
            pdfUrl: pdf,
            categoryId: categoryId,
            teacherDisciplineId: teacherDisciplineId
        }
    })

    return {id, name, pdf, teacherDisciplineId, categoryId}

}

export async function findTeacherIdByName(teacher:string){
    const result = await client.teachers.findFirst({
        where:{
            name: teacher
        }
    })

    return result.id
}

export async function findDisciplineIdByName(discipline:string){
    const result = await client.disciplines.findMany({
    })
    console.log(result);
    return result
}

export async function createTest(){

    const name = '2020/1';
    const pdf = 'https://educapes.capes.gov.br/retrieve/166324/eBook_Equacoes_Diferenciais-Licenciatura_Matematica_UFBA.pdf';

    const teacher = await createTeacher();
    const discipline = await createDiscipline();

    const {id: teacherDisciplineId} = await client.teachersDisciplines.create({
        data:{
            teacherId: teacher.id,
            disciplineId: discipline.id
        }
    })

    return {name, pdf, teacher, discipline}

}

