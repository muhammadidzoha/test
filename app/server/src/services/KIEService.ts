import { PrismaClient } from "@prisma/client";
import { ICreateKIEArticle } from "../types/kie";
import { NotFoundError } from "../common/exception";

export class KIEService {
    constructor(public prismaClient: PrismaClient) {

    }

    async createKIEArticle(kiePayload: ICreateKIEArticle & { tag: string[] }) {

        const tags = await Promise.all(kiePayload.tag.map(async (tag) => {
            const { tag: tagExist } = await this.getTagByName(tag);

            if (tagExist) {
                return tagExist;
            }

            return await this.prismaClient.kIETag.create({
                data: {
                    name: tag.toLowerCase()
                }
            });
        }))

        const kieArticle = await this.prismaClient.kIEContent.create({
            data: {
                title: kiePayload.title,
                updated_by: kiePayload.updatedBy,
                created_by: kiePayload.createdBy,
                description: kiePayload.description,
                type: 1,
                article: {
                    create: {
                        Content: kiePayload.content,
                        banner_url: kiePayload.bannerUrl,
                        thumbnail_url: kiePayload.thumbnailUrl,
                    }
                },
                kie_tag: {
                    connectOrCreate: tags.map((tag) => {
                        return {
                            where: {
                                id: tag.id
                            },
                            create: {
                                name: tag.name
                            }
                        }
                    })
                }
            },
            include: {
                article: true,
                user: true,
                kie_tag: true,
                kie_type: true
            }
        });

        return { kieArticle };
    }

    async getTagByName(name: string) {
        const tag = await this.prismaClient.kIETag.findFirst({
            where: {
                name: name.toLowerCase()
            }
        });

        return { tag };
    }

    async deleteArticleById(articleId: number) {
        const { article: isArticleExist } = await this.getArticleById(articleId);
        if (!isArticleExist) {
            throw new NotFoundError('Article not found');
        }
        const deletedArticle = await this.prismaClient.kIEContent.delete({
            where: {
                id: articleId,
            },
            include: {
                article: true,
                user: true,
                kie_tag: true,
                kie_type: true
            }

        });

        return { article: deletedArticle }
    }

    async getArticleById(articleId: number) {
        const article = await this.prismaClient.kIEContent.findFirst({
            where: {
                id: articleId
            },
            include: {
                article: true,
                user: true,
                kie_tag: true,
                kie_type: true
            }
        });

        return { article };
    }

    async getArticlesOwnedByInstitution(schoolId: number) {
        const articles = await this.prismaClient.kIEContent.findMany({
            where: {
                user: {
                    health_care_member: {
                        health_care: {
                            school_id: schoolId
                        }
                    }
                }
            }
        });

        return { articles }
    }

    async getKieContentsOwnedBySchool(schoolId: number) {
        const kieContents = await this.prismaClient.kIEContent.findMany({
            where: {
                user: {
                    health_care_member: {
                        health_care: {
                            school_id: schoolId
                        }
                    }
                }
            }
        });

        return {
            kieContents
        }
    }
};