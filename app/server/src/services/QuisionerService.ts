import { PrismaClient } from "@prisma/client";
import { IOption, IQuestions, IQuisioner, QuisionerPayload } from "../types/quisioner";
import { NotFoundError } from "../common/exception";

export class QuisionerService {
    constructor(public prismaClient: PrismaClient) { }

    async createQuisioner(payload: QuisionerPayload) {
        const quisioner = await this.prismaClient.quisioner.create({
            data: {
                title: payload.title,
                description: payload.description,
                stratification: payload.stratification,
                questions: {
                    create: payload.questions.map((question: IQuestions) => ({
                        question: question.question,
                        type: question.type,
                        is_required: question.isRequired,
                        ...((question.type === 'MULTIPLE_CHOICE' || question.type === 'SCALE') && {
                            options: {
                                create: question.options?.map(option => ({
                                    title: option.title,
                                    score: option.score ?? 0
                                }))
                            }
                        })
                    }))
                }
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        return { quisioner }
    }

    async deleteQuisioner(id: number) {
        const { quisioner: isQuisionerExist } = await this.getQuisionerById(id);
        if (!isQuisionerExist) {
            throw new NotFoundError('Quisioner not found');
        }

        const deletedQuisioner = await this.prismaClient.quisioner.delete({
            where: {
                id
            }
        });

        return {
            quisioner: deletedQuisioner
        }
    }

    async getQuisionerById(id: number) {
        const quisioner = await this.prismaClient.quisioner.findUnique({
            where: {
                id
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });


        return { quisioner };
    }
}