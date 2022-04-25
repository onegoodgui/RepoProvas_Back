import * as filterRepository from '../repositories/filterRepository.js'

export async function filterSearch(filter:string){

    if(filter === 'disciplines'){
        const result = await filterRepository.filterByDiscipline(filter)
        return result
    }
    if(filter = 'teachers'){
        const result = await filterRepository.filterByTeacher(filter);
        return result
    }
    
}