import * as filterRepository from '../repositories/filterRepository.js'

export async function filterSearch(filter:string, search: string){

    if(filter === 'disciplines'){
        const result = await filterRepository.filterByDiscipline(search)
        return result
    }
    if(filter = 'teachers'){
        const result = await filterRepository.filterByTeacher(search);
        return result
    }
    
}