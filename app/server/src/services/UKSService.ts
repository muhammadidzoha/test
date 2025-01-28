import { PrismaClient } from "@prisma/client";
import { IBookUKS } from "../types/uks";

export class UKSService {
    constructor(public prismaClient: PrismaClient) {

    }

    async addBook(healthCareId: number, createdBy: number, payload: IBookUKS) {
        const book = await this.prismaClient.uKSBook.create({
            data: {
                name: payload.name,
                description: payload.description,
                created_by: createdBy,
                updated_by: createdBy,
                file_url: payload.fileUrl,
                health_care_id: healthCareId,
                thumbnail_url: payload.thumbnailUrl
            }
        });

        return { book };
    }

    async getBooks(healthCareId: number) {
        const books = await this.prismaClient.uKSBook.findMany({
            where: {
                health_care_id: healthCareId
            }
        });

        return { books };
    }
};