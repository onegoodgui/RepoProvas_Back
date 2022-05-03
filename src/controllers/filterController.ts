import { Request, Response, NextFunction } from "express";
import * as filterServices from '../services/filterServices.js'

export interface FilterQueryString{
    filterSearch: string
}

export interface FilterParams{
    filterType: string
}

export interface FilterHeaders{
    authorization: string
}
export async function filterSearch(req:Request, res:Response){

    const {filterType}= req.params
    const {filterSearch} = req.query as {filterSearch : string}

    const result = await filterServices.filterSearch(filterType, filterSearch);
    res.send(result).status(200);
}