import { Request, Response, NextFunction } from "express";
import { InvariantError } from "../common/exception";
import { handleError } from "../common/http";
const parseValue = (value: any) => {
  if (!isNaN(value)) return Number(value); // Konversi ke Number jika angka
  if (value === "true") return true; // Konversi ke Boolean (true)
  if (value === "false") return false; // Konversi ke Boolean (false)
  return value; // Jika string biasa, tetap string
};

export const validateFormDataMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let parsedData: any = {};

    for (const key in req.body) {
      parsedData[key] = parseValue(req.body[key]);
    }

    if (req.file) {
      parsedData.file = req.file;
    }

    if (req.files) {
      parsedData.files = req.files;
    }

    const { error } = schema.validate(parsedData, { abortEarly: false });

    if (error) {
      res.status(400).json({
        status: "Fail",
        message: "Something error occured",
        errors: error.details.map((err: any) => err.message),
      });
      return;
    }

    next();
  };
};
