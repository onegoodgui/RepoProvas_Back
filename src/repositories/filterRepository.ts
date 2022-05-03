import { client } from "../database.js";

export async function filterByDiscipline(search:string){

    const disciplinesArray = await client.terms.findMany({
        where:{
            discipline:{
                some:{
                    name:{
                        startsWith: search,
                        mode: 'insensitive'
                    }
                }
                    
            }
        },
        
        select:{
            number:true,
            discipline:{
                
                where:{
                    name:{
                        startsWith: search,
                        mode: 'insensitive'
                    }
                },
                select:{
                    id: true,
                    name: true,
                    teachersDisciplines:{

                        select:{            
                        disciplineId: true,
                        id: true,
                        tests:{
                            orderBy:{
                                category:{
                                    name: 'asc'
                                }
                            },
                            select:{
                                id:true,
                                category:{
                                    
                                    select:{
                                        
                                        name:true,
                                        tests:{
                                            orderBy:{
                                                name:'asc'
                                            },
                                            include:{
                                                
                                                teacherDiscipline:{
                                                    select:{
                                                        disciplineId:true,
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


    return disciplinesArray
}

export async function filterByTeacher(search:string){

    const teachersArray = await client.teachers.findMany({

        where:{
            name:{
                startsWith:search,
                mode:'insensitive'
            }
        },
        select:{
            id: true,
            name:true,
            teachersDisciplines:{
                select:{
                    id:true,
                    teacherId: true,
                    discipline:true,
                    
                    tests:{
                        orderBy:{
                            category:{
                                name:'asc'
                            }
                        },
                        include:{
                            category:{
                                
                                select:{
                                    name:true,
                                    id: true,
                                    tests:{
                                        orderBy:{
                                            name:'asc'
                                        },
                                        select:{
                                            name: true,
                                            id: true,
                                            views: true,
                                            teacherDiscipline:{
                                                select:{
                                                    teacherId: true,
                                                    discipline:{
                                                        select:{
                                                            name:true,
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
        },

    })
    return teachersArray
}