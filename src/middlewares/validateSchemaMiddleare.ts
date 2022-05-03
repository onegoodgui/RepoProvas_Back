import { NextFunction, Request, Response } from "express";
import { errorTypes } from "./errorHandlerMiddleware.js";
import { ObjectSchema } from "joi";

export function validateSchemaMiddleware(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
      throw errorTypes.unprocessableEntityError('invalid data');
    }

    next();
  };
}
