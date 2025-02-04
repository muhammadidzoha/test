"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KIEService = void 0;
const exception_1 = require("../common/exception");
class KIEService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    createKIEContent(kiePayload, kieContentPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tags } = yield this.makeSureTagExist(kieContentPayload.tag);
            const kieContent = yield this.prismaClient.kIEContent.create({
                data: Object.assign(Object.assign(Object.assign(Object.assign({ title: kiePayload.title, updated_by: kiePayload.updatedBy, created_by: kiePayload.createdBy, description: kiePayload.description, type: kiePayload.type }, (kiePayload.type === 1 && {
                    article: {
                        create: {
                            Content: kieContentPayload.content,
                            banner_url: kieContentPayload.bannerUrl,
                            thumbnail_url: kieContentPayload.thumbnailUrl
                        }
                    }
                })), (kiePayload.type === 2 && {
                    poster: {
                        create: {
                            image_url: kieContentPayload.imageUrl,
                            thumbnail_url: kieContentPayload.thumbnailUrl
                        }
                    }
                })), (kiePayload.type === 3 && {
                    video: {
                        create: {
                            video_url: kieContentPayload.videoUrl,
                            thumbnail_url: kieContentPayload.thumbnailUrl
                        }
                    }
                })), { kie_tag: {
                        connectOrCreate: tags.map((tag) => {
                            return {
                                where: {
                                    id: tag.id
                                },
                                create: {
                                    name: tag.name
                                }
                            };
                        })
                    } }),
                include: Object.assign(Object.assign(Object.assign(Object.assign({}, (kiePayload.type === 1 && {
                    article: true
                })), (kiePayload.type === 2 && {
                    poster: true
                })), (kiePayload.type === 3 && {
                    video: true
                })), { user: true, kie_tag: true, kie_type: true })
            });
            return {
                kieContent
            };
        });
    }
    createKIEArticle(kiePayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tags } = yield this.makeSureTagExist(kiePayload.tag);
            const kieArticle = yield this.prismaClient.kIEContent.create({
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
                            };
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
        });
    }
    makeSureTagExist(kiePayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield Promise.all(kiePayload.map((tag) => __awaiter(this, void 0, void 0, function* () {
                const { tag: tagExist } = yield this.getTagByName(tag);
                if (tagExist) {
                    return tagExist;
                }
                return yield this.prismaClient.kIETag.create({
                    data: {
                        name: tag.toLowerCase()
                    }
                });
            })));
            return { tags };
        });
    }
    getTagByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.prismaClient.kIETag.findFirst({
                where: {
                    name: name.toLowerCase()
                }
            });
            return { tag };
        });
    }
    deleteKIEContentById(kieContentId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content: isContentExist } = yield this.getContentById(kieContentId, type);
            if (!isContentExist) {
                throw new exception_1.NotFoundError(`Content not found`);
            }
            const deletedContent = yield this.prismaClient.kIEContent.delete({
                where: {
                    id: kieContentId,
                    type
                },
                include: Object.assign(Object.assign(Object.assign(Object.assign({}, (type === 1 && {
                    article: true
                })), (type === 2 && {
                    poster: true
                })), (type === 3 && {
                    video: true
                })), { user: true, kie_tag: true, kie_type: true })
            });
            return { content: deletedContent };
        });
    }
    getContentById(contentId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.prismaClient.kIEContent.findFirst({
                where: {
                    id: contentId,
                    type
                },
                include: Object.assign(Object.assign(Object.assign(Object.assign({}, (type === 1 && {
                    article: true
                })), (type === 2 && {
                    poster: true
                })), (type === 3 && {
                    video: true
                })), { user: true, kie_tag: true, kie_type: true })
            });
            return { content };
        });
    }
    getContentsOwnedByInstitutionByType(schoolId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield this.prismaClient.kIEContent.findMany({
                where: {
                    user: {
                        health_care_member: {
                            health_care: {
                                school_id: schoolId
                            }
                        }
                    },
                    type
                },
                include: Object.assign(Object.assign(Object.assign(Object.assign({}, (type === 1 && {
                    article: true
                })), (type === 2 && {
                    poster: true
                })), (type === 3 && {
                    video: true
                })), { user: true, kie_tag: true, kie_type: true })
            });
            return {
                contents
            };
        });
    }
    updateKIEContentById(contentId, kiePayload, kieContentPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content: isContentexist } = yield this.getContentById(contentId, kiePayload.type);
            if (!isContentexist) {
                throw new exception_1.NotFoundError('Content not found');
            }
            const tagToRemove = isContentexist.kie_tag.filter(tag => !kieContentPayload.tag.includes(tag.name));
            const tagToAdd = kieContentPayload.tag.filter((tag) => isContentexist.kie_tag.map(tag => tag.name).includes(tag));
            const { tags: tagToAddOnDb } = yield this.makeSureTagExist(tagToAdd);
            const updatedContent = yield this.prismaClient.kIEContent.update({
                where: {
                    id: contentId
                },
                data: Object.assign(Object.assign(Object.assign({ title: kiePayload.title, description: kiePayload.description, created_by: kiePayload.createdBy, updated_by: kiePayload.updatedBy, kie_tag: {
                        disconnect: tagToRemove.map(tag => ({ id: tag.id })),
                        connect: tagToAddOnDb.map(tag => ({ id: tag.id }))
                    } }, (kiePayload.type === 1 && {
                    article: {
                        update: {
                            data: {
                                Content: kieContentPayload.content,
                                banner_url: kieContentPayload.bannerUrl,
                                thumbnail_url: kieContentPayload.thumbnailUrl
                            },
                            where: {
                                id: contentId
                            }
                        }
                    }
                })), (kiePayload.type === 2 && {
                    poster: {
                        update: {
                            data: {
                                image_url: kieContentPayload.imageUrl,
                                thumbnail_url: kieContentPayload.thumbnailUrl
                            },
                            where: {
                                id: contentId
                            }
                        }
                    }
                })), (kiePayload.type === 3 && {
                    video: {
                        update: {
                            data: {
                                video_url: kieContentPayload.videoUrl,
                                thumbnail_url: kieContentPayload.thumbnailUrl
                            },
                            where: {
                                id: contentId
                            }
                        }
                    }
                })),
                include: Object.assign(Object.assign(Object.assign(Object.assign({}, (kiePayload.type === 1 && {
                    article: true
                })), (kiePayload.type === 2 && {
                    poster: true
                })), (kiePayload.type === 3 && {
                    video: true
                })), { user: true, kie_tag: true, kie_type: true })
            });
            return {
                content: updatedContent
            };
        });
    }
    getContentsOwnedByInstitution(schoolId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield this.prismaClient.kIEContent.findMany({
                where: {
                    user: {
                        health_care_member: {
                            health_care: {
                                school_id: schoolId
                            }
                        }
                    }
                },
                include: {
                    article: true,
                    poster: true,
                    video: true,
                    user: true,
                    kie_tag: true,
                    kie_type: true
                }
            });
            return { contents };
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield this.prismaClient.kIETag.findMany();
            return { tags };
        });
    }
    getTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const types = yield this.prismaClient.kIEType.findMany();
            return { types };
        });
    }
}
exports.KIEService = KIEService;
;
