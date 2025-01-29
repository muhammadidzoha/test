import { Request, Response } from "express";
import { handleError, validatePayload } from "../common/http";
import { createKIEArticleSchema } from "../common/http/requestvalidator/UKSValidator";
import { KIEService } from "../services/KIEService";
import { ICreateKIEArticle } from "../types/kie";
import { InvariantError, NotFoundError } from "../common/exception";

export class KIEController {
    constructor(public kieService: KIEService) {

    }

    async createKIEArticle(req: Request, res: Response) {
        try {
            validatePayload(createKIEArticleSchema, req.body);
            const user = (req as any).user;
            const payload: ICreateKIEArticle & { tags: string[] } = req.body;
            const { banner, thumbnail } = req.files as any;


            const { kieArticle } = await this.kieService.createKIEArticle({
                ...payload,
                createdBy: user.id,
                updatedBy: user.id,
                tag: payload.tags,
                bannerUrl: !banner ? undefined : banner[0]?.filename,
                thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename,
                type: +payload.type
            });

            res.status(201).json({
                status: 'Success',
                message: 'KIE article created successfully',
                data: kieArticle
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async deleteKIEArticle(req: Request, res: Response) {
        try {
            const { articleId } = req.params;
            if (!articleId) {
                throw new InvariantError('Article id is required in params');
            }
            const { article } = await this.kieService.deleteArticleById(+articleId);
            res.status(200).json({
                status: 'Success',
                message: 'Article deleted successfully',
                data: article
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getArticleById(req: Request, res: Response) {
        try {
            const { articleId } = req.params;
            if (!articleId) {
                throw new InvariantError('Article id is required in params');
            }
            const { article } = await this.kieService.getArticleById(+articleId);
            if (!article) {
                throw new NotFoundError('Article not found');
            }
            res.status(200).json({
                status: 'Success',
                message: 'Article fetched successfully',
                data: article
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getArticlesOwnedByInstitution(req: Request, res: Response) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                throw new InvariantError('School id is required in params');
            }
            const { articles } = await this.kieService.getArticlesOwnedByInstitution(+schoolId);
            res.status(200).json({
                status: 'Success',
                message: 'Articles fetched successfully',
                data: articles
            })
        } catch (err: any) {
            handleError(err, res);
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

    async updateKIEArticle(req: Request, res: Response) {
        try {
            validatePayload(createKIEArticleSchema, req.body);
            const { articleId } = req.params;
            if (!articleId) {
                throw new InvariantError('Article id is required in params');
            }

            const user = (req as any).user;
            const payload: ICreateKIEArticle & { tags: string[] } = req.body;
            console.log({ files: req.files, articleId, user, payload });
            const { banner, thumbnail } = req.files ?? { banner: undefined, thumbnail: undefined } as any;
            console.log({ banner, thumbnail });

            const { article } = await this.kieService.updateArticleById(+articleId, {
                ...payload,
                createdBy: user.id,
                updatedBy: user.id,
                tag: payload.tags,
                bannerUrl: !banner ? undefined : banner[0]?.filename,
                thumbnailUrl: !thumbnail ? undefined : thumbnail[0]?.filename,
                type: +payload.type,
            });

            res.status(201).json({
                status: 'Success',
                message: `KIE with article id ${articleId} updated successfully`,
                data: article
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
};