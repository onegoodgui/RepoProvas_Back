import { client } from "../database.js";

export async function filterByDiscipline(filter: string){

    const disciplinesArray = await client.terms.findMany({
       select:{
            number:true,
            discipline:{
                select:{
                    name: true,
                    teachersDisciplines:{
                        select:{
                        id: true,
                        tests:{
                            select:{
                                id:true,
                                category:{
                                    select:{
                                        name:true,
                                        tests:{
                                            include:{
                                                teacherDiscipline:{
                                                    select:{
                                                        teacher:{
                                                            select:{
                                                                name:true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        
                                    }
                                }
                                
                            }
                          
                        }
                        }
                    }
                }
            }
        }
    })

    console.log(disciplinesArray[0].discipline[0].teachersDisciplines[0].tests[0].category);
    return disciplinesArray
}

export async function filterByTeacher(filter:string){

    const teachersArray = await client.teachers.findMany(
        {
            select:{
                name:true,
                teachersDisciplines:{
                    select:{
                        id:true,
                        discipline:true,
                        tests:{
                            include:{
                                category:{
                                    select:{
                                        name:true
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }
        }
    )
    return teachersArray
}