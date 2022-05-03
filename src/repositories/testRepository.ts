import { client } from "../database.js";
import { CreateTestData } from "../services/testServices.js";

export async function updateViews(id: number){

    const result = await client.tests.update({
        where:{
            id: id,
        },
        data:{
            views:{
                increment: 1,
            }
        }
        
    })

    return result
}

export async function getTests(){

    const categories = await client.categories.findMany();
        
    const disciplines = await client.disciplines.findMany({
        select:{
            name: true,
            id: true
        }
    });
    

    return {categories, disciplines}
}

export async function getTeachersByDiscipline(disciplineId:number){

    const teachers = await client.teachers.findMany({
        where:{
            teachersDisciplines:{
                some:{
                    discipline:{
                        id: disciplineId
                    }
                }
            }
        },
        
    })

    return {teachers}
}

export async function getCategoryId(category: string){

    return await client.categories.findFirst({
        where:{
            name: category
        },
        select:{
            id: true
        }
    })
}

export async function getTeacherDisciplineId(discipline:string, teacher:string){

    return await client.teachersDisciplines.findFirst({
        where:{
            teacher:{
                name:{
                    equals: teacher
                }
            },
            discipline:{
                name:{
                    equals:discipline
                }
            }
        },
        select:{
            id:true
        }
    });
}

export async function getTestById(id: number){
    return await client.tests.findUnique({
        where:{
            id: id
        }
    })
}


export async function testExists(testName: string, categoryId: number, teacherDisciplineId: number){

    const storedTest = await client.tests.findFirst({

        where:{
            name: testName,
            categoryId: categoryId,
            teacherDisciplineId: teacherDisciplineId
        }
        
    })

    return storedTest
}

export async function insertTest(test:CreateTestData, categoryId: number, teacherDisciplineId: number){

    return await client.tests.create({
        data:{
            name:test.name,
            pdfUrl:test.url,
            categoryId: categoryId,
            teacherDisciplineId: teacherDisciplineId,
        }
    })
}