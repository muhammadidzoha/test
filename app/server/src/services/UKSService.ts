import { PrismaClient } from "@prisma/client";
import { IBookUKS } from "../types/uks";
import { NotFoundError } from "../common/exception";

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

    async deleteBookOwnedByHealthCare(healthCareId: number, bookId: number) {
        const { book: isBookExists } = await this.getbookOwnedByHealthCare(healthCareId, bookId);
        if (!isBookExists) {
            throw new NotFoundError('Book not found');
        }
        const book = await this.prismaClient.uKSBook.delete({
            where: {
                id: bookId,
                health_care_id: healthCareId
            }
        });

        return { book };
    }

    async getbookOwnedByHealthCare(healthCareId: number, bookId: number) {
        const book = await this.prismaClient.uKSBook.findFirst({
            where: {
                id: bookId,
                health_care_id: healthCareId
            }
        });

        return { book };
    }
};