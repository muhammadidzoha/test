import { PrismaClient } from "@prisma/client";
import { AuthorizationError, NotFoundError } from "../common/exception";

export class UserService {
    constructor(public prismaClient: PrismaClient) {

    }

    async checkUserExists(uniqueIdentity: string) {
        const user = await this.getUserByUniqueIdentity(uniqueIdentity);

        return !!user;
    }

    async getUserByUniqueIdentity(uniqueIdentity: string) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                OR: [
                    {
                        email: uniqueIdentity
                    },
                    {
                        username: uniqueIdentity
                    }
                ]
            }
        });

        return { user };
    }

    async getUserByUsername(username: string) {
        if (username.includes('admin')) {
            throw new AuthorizationError('You are not authorized to view this resource');
        }
        const user = await this.prismaClient.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return { user };
    }

    async getUserByEmail(email: string) {
        if (email.includes('admin')) {
            throw new AuthorizationError('You are not authorized to view this resource');
        };
        const user = await this.prismaClient.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return { user };
    }

    async getUsers() {
        const users = await this.prismaClient.user.findMany();

        return { users };
    }

    async getUserById(id: number) {
        if (id === 1) {
            throw new AuthorizationError('You are not authorized to view this resource');
        }
        const user = await this.prismaClient.user.findUnique({
            where: {
                id
            }
        });

        return { user }
    }
};