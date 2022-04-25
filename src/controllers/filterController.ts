import { Request, Response, NextFunction } from "express";
import * as filterServices from '../services/filterServices.js'

export async function filterSearch(req:Request, res:Response){

    const {filterType}= req.params

    const result = await filterServices.filterSearch(filterType);
    res.send(result).status(200);
}