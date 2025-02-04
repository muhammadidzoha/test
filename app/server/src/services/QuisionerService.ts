import { PrismaClient } from "@prisma/client";
import { IOption, IQuestions, IQuisioner, IResponsePayload, QuisionerPayload } from "../types/quisioner";
import { InvariantError, NotFoundError } from "../common/exception";

export class QuisionerService {
    constructor(public prismaClient: PrismaClient) { }

    async createQuisioner(payload: QuisionerPayload) {
        if (payload.stratification) {
            const { quisioner } = await this.getQuisionerByStratification(payload.stratification);
            if (quisioner) {
                throw new InvariantError('Quisioner already exist for this stratification');
            }
        }
        const quisioner = await this.prismaClient.quisioner.create({
            data: {
                title: payload.title,
                description: payload.description,
                stratification: payload.stratification,
                for: payload.for,
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

    async getQuisionerByStratification(stratification: string) {
        const quisioner = await this.prismaClient.quisioner.findUnique({
            where: {
                stratification
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
                },
                response: {
                    include: {
                        answers: true
                    }
                }

            }
        });


        return { quisioner };
    }

    async getAllQuisioners(forWho?: string) {
        const quisioners = await this.prismaClient.quisioner.findMany({
            ...(forWho && ({
                where: {
                    for: forWho
                }
            })),
            include: {
                questions: {
                    include: {
                        options: true,
                    }
                },
                response: {
                    include: {
                        answers: true
                    }
                }
            }
        });

        return { quisioners }
    }

    async responseQuisioner(responsePayload: IResponsePayload) {
        if (responsePayload.response.familyMemberId) {
            await this.checkIfQuisionerIsAnswered(responsePayload.response.familyMemberId, responsePayload.response.quisionerId);
        }
        if (responsePayload.response.institutionId) {
            await this.checkIfQuisionerIsAnswered(responsePayload.response.institutionId, responsePayload.response.quisionerId);
        }
        const response = await this.prismaClient.response.create({
            data: {
                quisioner_id: responsePayload.response.quisionerId,
                family_member_id: responsePayload.response.familyMemberId,
                institution_id: responsePayload.response.institutionId,
                total_score: responsePayload.response.totalScore,
                answers: {
                    create: responsePayload.answers.map(answer => ({
                        question_id: answer.questionId,
                        score: answer.score ?? 0,
                        boolean_value: answer.booleanValue,
                        option_id: answer.optionId,
                        scaleValue: answer.scaleValue,
                        text_value: answer.textValue,
                    }))
                },
            },
            include: {
                quisioner: {
                    include: {
                        questions: {
                            include: {
                                options: true
                            }
                        }
                    }
                },
                answers: true,
                family_member: true,
                institution: true
            }
        });

        return { response }
    }

    async checkIfQuisionerIsAnswered(answeredBy: number, quisionerId: number) {
        const quisioner = await this.prismaClient.quisioner.findFirst({
            where: {
                id: quisionerId,
                response: {
                    some: {
                        family_member_id: answeredBy
                    }
                }
            }
        })
        if (!!quisioner) {
            throw new InvariantError('Quisioner already answered by this family member');
        }
    }

    async getQuisionerResponseById(responseId: number) {
        const response = await this.prismaClient.response.findUnique({
            where: {
                id: responseId,
            },
            include: {
                quisioner: true,
                answers: true,
                family_member: true,
                institution: true
            }
        });

        return { response };
    }

    async getResponsesByFamilyId(familyId: number) {
        const responses = await this.prismaClient.response.findMany({
            where: {
                family_member: {
                    id: familyId
                }
            },
            include: {
                answers: true,
                quisioner: {
                    include: {
                        questions: {
                            include: {
                                options: true
                            }
                        }
                    }
                },
                family_member: true,
            }
        });

        return { responses }
    }

    async getResponseByInstitutionId(institutionId: number) {
        const responses = await this.prismaClient.response.findMany({
            where: {
                institution: {
                    id: institutionId
                }
            },
            include: {
                answers: true,
                quisioner: {
                    include: {
                        questions: {
                            include: {
                                options: true
                            }
                        }
                    }
                },
                institution: true,
            }
        });

        return { responses }
    }
}