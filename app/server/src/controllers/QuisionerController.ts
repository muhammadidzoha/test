import { Request, Response } from "express";
import { QuisionerService } from "../services/QuisionerService";
import { handleError, validatePayload } from "../common/http";
import { createQuisionerSchema, createResponseQuisioner } from "../common/http/requestvalidator/QuisionerValidator";
import { InvariantError, NotFoundError } from "../common/exception";
import { IAnswer, IResponsePayload } from "../types/quisioner";

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
                throw new InvariantError('Quisioner id is required');
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

    async responseQuisioner(req: Request, res: Response) {
        try {
            validatePayload(createResponseQuisioner, req.body);
            const { quisionerId } = req.params;
            if (!quisionerId) {
                throw new InvariantError('Quisioner id is required');
            }
            const { familyMemberId, institutionId } = req.body;
            if (!familyMemberId && !institutionId) {
                throw new InvariantError('Family member id or institution id is required in body');
            }
            const payload = req.body;
            const { booleanValue, textValue, scaleValue, optionId } = payload.answers[0];
            if (!booleanValue && !textValue && !scaleValue && !optionId) {
                throw new InvariantError('Answer.value is required');
            }

            const totalScore = payload.answers?.reduce((acc: number, answer: any) => acc + answer.score, 0) ?? 0;
            const { response } = await this.quisionerService.responseQuisioner({
                response: {
                    familyMemberId: payload.familyMemberId,
                    institutionId: payload.institutionId,
                    quisionerId: +quisionerId,
                    totalScore: payload.answers?.reduce((acc: number, answer: any) => acc + answer.score, 0) ?? 0
                },
                answers: payload.answers.map((answer: IAnswer) => ({
                    questionId: answer.questionId,
                    score: answer.score,
                    booleanValue: answer.booleanValue,
                    textValue: answer.textValue,
                    scaleValue: answer.scaleValue,
                    optionId: answer.optionId
                }))
            });

            console.log({ body: req.body });
            res.status(201).json({
                status: 'Success',
                message: 'Quisioner response created successfully',
                data: response
            })

        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getQuisionerResponseById(req: Request, res: Response) {
        try {
            const { responseId } = req.params;
            if (!responseId) {
                throw new InvariantError('Quisioner id is required');
            }
            const { response } = await this.quisionerService.getQuisionerResponseById(+responseId);
            if (!response) {
                throw new NotFoundError('Quisioner response not found');
            }
            res.status(200).json({
                status: 'Success',
                message: `Quisioner response with id ${response.id} fetched successfully`,
                data: response
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getResponseByFamilyId(req: Request, res: Response) {
        try {
            const { familyMemberId } = req.params;
            if (!familyMemberId) {
                throw new InvariantError('Family member id is required');
            }
            const { responses } = await this.quisionerService.getResponsesByFamilyId(+familyMemberId);
            if (!responses) {
                throw new NotFoundError('Quisioner response not found');
            }
            res.status(200).json({
                status: 'Success',
                message: `Quisioner responses fetched successfully`,
                data: responses
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getQuisionerResponseByInstitutionId(req: Request, res: Response) {
        try {
            const { institutionId } = req.params;
            if (!institutionId) {
                throw new InvariantError('Institution id is required');
            }
            const { responses } = await this.quisionerService.getResponseByInstitutionId(+institutionId);
            if (!responses) {
                throw new NotFoundError('Quisioner response not found');
            }
            res.status(200).json({
                status: 'Success',
                message: `Quisioner responses fetched successfully`,
                data: responses
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
}