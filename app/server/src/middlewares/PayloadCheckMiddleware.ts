import { NextFunction, Request, Response } from "express";
import { handleError, validatePayload } from "../common/http";
import Joi from "joi";

export const payloadCheckMiddleware = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);
            validatePayload(schema, req.body); // Validate the payload
            next(); // Proceed if validation passes
        } catch (error: any) {
            handleError(error, res); // Handle the error and send a response
        }
    };
};