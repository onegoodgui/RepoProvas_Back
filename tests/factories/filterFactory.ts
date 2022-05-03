import { client } from "../../src/database";
import faker from "@faker-js/faker";

export async function createDiscipline(){

    const discipline = await client.disciplines.create({
        data:{
            name: 'Algoritmos',
            termId: 1
        }
    })

    return discipline
}