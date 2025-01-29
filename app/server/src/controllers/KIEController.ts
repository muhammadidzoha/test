import { Request, Response } from "express";
import { handleError, validatePayload } from "../common/http";
import { createKIEArticleSchema } from "../common/http/requestvalidator/UKSValidator";
import { KIEService } from "../services/KIEService";
import { ICreateKIEArticle } from "../types/kie";
import { InvariantError, NotFoundError } from "../common/exception";

export class KIEController {
    constructor(public kieService: KIEService) {

    }

    async createKIEContent(req: Request, res: Response) {
        try {
            const { type } = req.params;
            let typeId = 1;
            if (!type) {
                throw new InvariantError('Type is required in params');
            }
            if (type === 'article') {
                validatePayload(createKIEArticleSchema, req.body);
                typeId = 1
            }
            if (type === 'poster') {
                validatePayload(createKIEArticleSchema, req.body);
                typeId = 2
            }
            if (type === 'video') {
                validatePayload(createKIEArticleSchema, req.body);
                typeId = 3
            }
            const user = (req as any).user;
            const payload: any & { tags: string[] } = req.body;
            const { banner, thumbnail, imageUrl, videoUrl } = req.files as any;

            let contentPayload = null;

            if (typeId === 1) {
                contentPayload = {
                    content: payload.content,
                    bannerUrl: !banner ? undefined : banner[0]?.filename,
                    thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename
                }
            };
            if (typeId === 2) {
                contentPayload = {
                    imageUrl: !imageUrl ? undefined : imageUrl[0]?.filename,
                    thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename
                }
            }
            if (typeId === 3) {
                contentPayload = {
                    videoUrl: !videoUrl ? undefined : videoUrl[0]?.filename,
                    thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename
                }
            }

            const { kieContent } = await this.kieService.createKIEContent({
                createdBy: user.id,
                description: payload.description,
                title: payload.title,
                type: typeId,
                updatedBy: user.id
            }, {
                ...contentPayload,
                tag: payload.tags
            })

            res.status(201).json({
                status: 'Success',
                message: 'KIE article created successfully',
                data: kieContent
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async deleteKIEContent(req: Request, res: Response) {
        try {
            const { contentId, type } = req.params;
            if (!contentId || !type) {
                throw new InvariantError('Content id and type is required in params');
            }
            let typeId = 1;
            if (type === 'article') {
                typeId = 1
            }
            if (type === 'poster') {
                typeId = 2
            }
            if (type === 'video') {
                typeId = 3
            }
            const { content } = await this.kieService.deleteKIEContentById(+contentId, typeId);
            res.status(200).json({
                status: 'Success',
                message: 'Content deleted successfully',
                data: content
            })
        } catch (err: any) {
            handleError(err, res)
        }
    }

    async getKIEContent(req: Request, res: Response) {
        try {
            const { contentId, type } = req.params;
            if (!contentId || !type) {
                throw new InvariantError('Content id and type is required in params');
            }
            let typeId = 1;
            if (type === 'article') {
                typeId = 1
            }
            if (type === 'poster') {
                typeId = 2
            }
            if (type === 'video') {
                typeId = 3
            }
            const { content } = await this.kieService.getContentById(+contentId, typeId);
            res.status(200).json({
                status: 'Success',
                message: 'Content fetched successfully',
                data: content
            })
        } catch (err: any) {
            handleError(err, res)
        }
    }




    async getKIEContents(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School id is required in params');
            }
            const { kieContents } = await this.kieService.getKieContentsOwnedBySchool(+schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'KIE contents fetched successfully',
                data: kieContents
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getKieContentsOwnedByInstitutionByType(req: Request, res: Response) {
        try {
            const { schoolId, type } = req.params;
            if (!schoolId || !type) {
                throw new InvariantError('School id and type is required in params');
            }
            let typeId = 1;
            if (type === 'article') {
                typeId = 1
            }
            if (type === 'poster') {
                typeId = 2
            }
            if (type === 'video') {
                typeId = 3
            }
            const { contents } = await this.kieService.getContentsOwnedByInstitutionByType(+schoolId, typeId);
            res.status(200).json({
                status: 'Success',
                message: 'KIE contents fetched successfully',
                data: contents
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    // async updateKIEArticle(req: Request, res: Response) {
    //     try {
    //         validatePayload(createKIEArticleSchema, req.body);
    //         const { articleId } = req.params;
    //         if (!articleId) {
    //             throw new InvariantError('Article id is required in params');
    //         }

    //         const user = (req as any).user;
    //         const payload: ICreateKIEArticle & { tags: string[] } = req.body;
    //         console.log({ files: req.files, articleId, user, payload });
    //         const { banner, thumbnail } = req.files ?? { banner: undefined, thumbnail: undefined } as any;
    //         console.log({ banner, thumbnail });

    //         const { article } = await this.kieService.updateArticleById(+articleId, {
    //             ...payload,
    //             createdBy: user.id,
    //             updatedBy: user.id,
    //             tag: payload.tags,
    //             bannerUrl: !banner ? undefined : banner[0]?.filename,
    //             thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename,
    //             type: +payload.type,
    //         });

    //         res.status(201).json({
    //             status: 'Success',
    //             message: `KIE with article id ${articleId} updated successfully`,
    //             data: article
    //         })
    //     } catch (err: any) {
    //         handleError(err, res);
    //     }
    // }
};