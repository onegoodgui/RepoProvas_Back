import { client } from "../src/database.js";

async function main(){

    await client.terms.upsert({
        where:{
            number: 1,
        },
        update:{},
        create:{
            number: 1,
        }
    });

    await client.terms.upsert({
        where:{
            number: 2,
        },
        update:{},
        create:{
            number: 2,
        }
    })

    await client.terms.upsert({
        where:{
            number: 3,
        },
        update:{},
        create:{
            number: 3,
        }
    })

    await client.categories.upsert({
        where:{
            name: 'P1',
        },
        update:{},
        create:{
            name:'P1',
        }
    })

    await client.categories.upsert({
        where:{
            name: 'P2',
        },
        update:{},
        create:{
            name:'P2',
        }
    })

    await client.categories.upsert({
        where:{
            name: 'P3',
        },
        update:{},
        create:{
            name:'P3',
        }
    })

    await client.teachers.upsert({
        where:{
            name: 'Dóris',
        },
        update:{},
        create:{
            name:'Dóris',
        }
    })

    await client.teachers.upsert({
        where:{
            name: 'Juliano',
        },
        update:{},
        create:{
            name:'Juliano',
        }
    })

    await client.teachers.upsert({
        where:{
            name: 'Ivone',
        },
        update:{},
        create:{
            name:'Ivone',
        }
    });

    await client.teachers.upsert({
        where:{
            name: 'Cydara',
        },
        update:{},
        create:{
            name:'Cydara',
        }
    })

    await client.teachers.upsert({
        where:{
            name: 'Inácio',
        },
        update:{},
        create:{
            name:'Inácio',
        }
    })

    await client.disciplines.upsert({
        where:{
            name: 'Algoritmos',
        },
        update:{},
        create:{
            name:'Algoritmos',
            termId: 1,
        }
    })

    await client.disciplines.upsert({
        where:{
            name: 'Cálculo',
        },
        update:{},
        create:{
            name:'Cálculo',
            termId: 1,
        }
    })

    await client.disciplines.upsert({
        where:{
            name: 'Álgebra Linear',
        },
        update:{},
        create:{
            name:'Álgebra Linear',
            termId: 2,
        }
    })

    await client.disciplines.upsert({
        where:{
            name: 'Cálculo II',
        },
        update:{},
        create:{
            name:'Cálculo II',
            termId: 2,
        }
    })

    await client.disciplines.upsert({
        where:{
            name: 'Equações Diferenciais',
        },
        update:{},
        create:{
            name:'Equações Diferenciais',
            termId: 3,
        }
    })

    await client.disciplines.upsert({
        where:{
            name: 'Probabilidade e Estatística',
        },
        update:{},
        create:{
            name:'Probabilidade e Estatística',
            termId: 3,
        }
    })

    await client.disciplines.upsert({
        where:{
            name: 'Mecânica Vetorial',
        },
        update:{},
        create:{
            name:'Mecânica Vetorial',
            termId: 4,
        }
    })
    

}


main().catch(e => {
    console.log(e);
    process.exit(1)
}).finally(async () => {
    await client.$disconnect()
})