import { Request, Response } from "express";
import { UKSService } from "../services/UKSService";
import { handleError, validatePayload } from "../common/http";
import { addBookSchema } from "../common/http/requestvalidator/UKSValidator";
import { InvariantError, NotFoundError } from "../common/exception";
import { IBookUKS } from "../types/uks";

export class UKSController {
    constructor(public UKSService: UKSService) {

    }

    async addBook(req: Request, res: Response) {
        try {
            validatePayload(addBookSchema, req.body);
            const { healthCareId } = req.params;
            if (!healthCareId) {
                throw new InvariantError('Health care id is required in params');
            }

            const { thumbnail, file } = req.files as any;
            console.log({ thumbnail, file })

            const user = (req as any).user;
            const payload: IBookUKS = req.body;

            const { book } = await this.UKSService.addBook(+healthCareId, user.id, {
                ...payload,
                thumbnailUrl: thumbnail[0].filename,
                fileUrl: file[0].filename
            });

            res.status(201).json({
                status: 'Success',
                message: 'Book added successfully',
                data: book
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getBooks(req: Request, res: Response) {
        try {
            const { healthCareId } = req.params;
            if (!healthCareId) {
                throw new InvariantError('Health care id is required in params');
            }
            const { books } = await this.UKSService.getBooks(+healthCareId);

            res.status(200).json({
                status: 'Success',
                message: 'Books fetched successfully',
                data: books
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async deleteBook(req: Request, res: Response) {
        try {
            const { healthCareId, bookId } = req.params;
            if (!healthCareId || !bookId) {
                throw new InvariantError('Health care id and book id is required in params');
            }

            const { book } = await this.UKSService.deleteBookOwnedByHealthCare(+healthCareId, +bookId);

            res.status(200).json({
                status: 'Success',
                message: `Book with id ${bookId} deleted successfully`,
                data: book
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getBookOwnedByHealthCare(req: Request, res: Response) {
        try {
            const { healthCareId, bookId } = req.params;

            if (!healthCareId || !bookId) {
                throw new InvariantError('Health care id and book id is required in params');
            }

            const { book } = await this.UKSService.getbookOwnedByHealthCare(+healthCareId, +bookId);

            if (!book) {
                throw new NotFoundError(`Book with id ${bookId} not found`);
            }

            res.status(200).json({
                status: 'Success',
                message: `Book with id ${bookId} fetched successfully`,
                data: book
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
}