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
            const { banner, thumbnail, image, video } = req.files as any;
            if (!type) {
                throw new InvariantError('Type is required in params');
            }
            if (type === 'article') {
                validatePayload(createKIEArticleSchema, req.body);
                typeId = 1
            }
            if (type === 'poster') {
                validatePayload(createKIEArticleSchema, req.body);
                if (!image) {
                    throw new InvariantError('Image is required for poster');
                }
                typeId = 2
            }
            if (type === 'video') {
                validatePayload(createKIEArticleSchema, req.body);
                if (!video) {
                    throw new InvariantError('Video is required for video');
                }
                typeId = 3
            }
            const user = (req as any).user;
            const payload: any & { tags: string[] } = req.body;

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
                    imageUrl: !image ? undefined : image[0]?.filename,
                    thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename
                }
            }
            if (typeId === 3) {
                contentPayload = {
                    videoUrl: !video ? undefined : video[0]?.filename,
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
                message: `KIE ${type} created successfully`,
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

    async getKieContentsOwnedByInstitutionByType(req: Request, res: Response) {
        try {
            console.log({ name: 'getKieContentsOwnedByInstitutionByType' })
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

    async updateKIEContent(req: Request, res: Response) {
        try {
            const { contentId, type } = req.params;
            if (!contentId || !type) {
                throw new InvariantError('Content id and type is required in params');
            }
            const { banner, thumbnail, image, video } = req.files as any;

            let typeId = 1;
            if (type === 'article') {
                validatePayload(createKIEArticleSchema, req.body);
                typeId = 1
            }
            if (type === 'poster') {
                validatePayload(createKIEArticleSchema, req.body);
                if (!image) {
                    throw new InvariantError('Image is required for video');
                }
                typeId = 2
            }
            if (type === 'video') {
                validatePayload(createKIEArticleSchema, req.body);
                if (!video) {
                    throw new InvariantError('Video is required for video');
                }
                typeId = 3
            }
            const user = (req as any).user;
            const payload: any & { tags: string[] } = req.body;
            let contentPayload = {};
            if (typeId === 1) {
                contentPayload = {
                    content: payload.content,
                    bannerUrl: !banner ? undefined : banner[0]?.filename,
                    thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename
                }
            };
            if (typeId === 2) {
                contentPayload = {
                    imageUrl: !image ? undefined : image[0]?.filename,
                    thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename
                }
            }
            if (typeId === 3) {
                contentPayload = {
                    videoUrl: !video ? undefined : video[0]?.filename,
                    thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename
                }
            }

            const { content } = await this.kieService.updateKIEContentById(+contentId, {
                createdBy: user.id,
                description: payload.description,
                title: payload.title,
                type: typeId,
                updatedBy: user.id
            }, {
                ...contentPayload,
                tag: payload.tags
            });

            res.status(200).json({
                status: 'Success',
                message: `KIE with content id ${contentId} updated successfully`,
                data: content
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getKieContentsOwnedByInstitution(req: Request, res: Response) {
        try {
            console.log({ name: 'getKieContentsOwnedByInstitution' })

            const { schoolId } = req.params;
            console.log({ schoolId });
            if (!schoolId) {
                throw new InvariantError('School id is required in params');
            }
            const { contents } = await this.kieService.getContentsOwnedByInstitution(+schoolId);

            res.status(200).json({
                status: 'Success',
                message: 'KIE contents fetched successfully',
                data: contents
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getTags(req: Request, res: Response) {
        try {
            const { tags } = await this.kieService.getTags();
            res.status(200).json({
                status: 'Success',
                message: 'Tags fetched successfully',
                data: tags
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getTypes(req: Request, res: Response) {
        try {
            const { types } = await this.kieService.getTypes();
            res.status(200).json({
                status: 'Success',
                message: 'Types fetched successfully',
                data: types
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
};