import { Request, Response } from "express";
import { QuisionerService } from "../services/QuisionerService";
import { handleError, validatePayload } from "../common/http";
import { createQuisionerSchema } from "../common/http/requestvalidator/QuisionerValidator";
import { NotFoundError } from "../common/exception";

export class QuisionerController {
    constructor(public quisionerService: QuisionerService) { }

    async createQuisioner(req: Request, res: Response) {
        try {
            validatePayload(createQuisionerSchema, req.body);
            const payload = req.body;
            const quistioner = await this.quisionerService.createQuisioner(payload);
            res.status(201).json({
                status: 'success',
                message: 'Quisioner created successfully',
                data: quistioner
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async deleteQuisionerById(req: Request, res: Response) {
        try {
            const { quisionerId } = req.params
            if (!quisionerId) {
                throw new Error('Quisioner id is required');
            }
            const { quisioner } = await this.quisionerService.deleteQuisioner(+quisionerId);
            res.status(200).json({
                status: 'Success',
                message: `Quisioner with id ${quisioner.id} deleted successfully`,
                data: quisioner
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getQuisionerById(req: Request, res: Response) {
        try {
            const { quisionerId } = req.params;
            if (!quisionerId) {
                throw new Error('Quisioner id is required');
            }
            const { quisioner } = await this.quisionerService.getQuisionerById(+quisionerId);
            if (!quisioner) {
                throw new NotFoundError('Quisioner not found');
            }
            res.status(200).json({
                status: 'Success',
                message: `Quisioner with id ${quisioner.id} fetched successfully`,
                data: quisioner
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getAllQuisioners(req: Request, res: Response) {
        try {
            const { forWho } = req.query;
            console.log({ forWho });
            const quisioners = await this.quisionerService.getAllQuisioners(forWho as string ?? undefined);
            res.status(200).json({
                status: 'Success',
                message: 'Quisioners fetched successfully',
                data: quisioners
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getAllQuisionersByFor(req: Request, res: Response) {
        try {
            const { forWho } = req.query;
            const quisioners = await this.quisionerService.getAllQuisioners(forWho as string);
            res.status(200).json({
                status: 'Success',
                message: 'Quisioners fetched successfully',
                data: quisioners
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
}