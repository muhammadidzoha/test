import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../common/exception";

export class AuthService {
    constructor(public prismaClient: PrismaClient, public bcrypt: any, public jwt: any) {
    }
    async register(uniqueIdentity: string, password: string, roleId: number = 1): Promise<{
        newUser: {
            id: number;
            username: string;
            password: string;
            roleId: number
        }
    }> {
        const userOnDatabase = await this.prismaClient.user.findUnique({
            where: {
                username: uniqueIdentity
            },
        })

        if (!!userOnDatabase) {
            throw new InvariantError('Username already exists');
        }

        const newPassword = await this.bcrypt.hash(password, 10);

        const newUser = await this.prismaClient.user.create({
            data: {
                username: uniqueIdentity,
                password: newPassword,
                roleId: roleId
            },
        });

        return {
            newUser
        }
    }

    async login(uniqueIdentity: string, password: string): Promise<{
        accessToken: string;
    }> {
        const userOnDatabase = await this.prismaClient.user.findUnique({
            where: {
                username: uniqueIdentity
            }
        })

        if (!userOnDatabase) {
            throw new InvariantError('User not found');
        }

        const isPasswordMatch = await this.bcrypt.compare(password, userOnDatabase.password);
        if (!isPasswordMatch) {
            throw new InvariantError('Password is incorrect');
        }
        const userRole = await this.prismaClient.role.findUnique({
            where: {
                id: userOnDatabase.roleId
            }
        })

        const accessToken = this.jwt.sign({
            id: userOnDatabase.id,
            username: userOnDatabase.username,
            role: userRole?.name ?? 'orangtua'
        }, process.env.SECRET_ACCESS_TOKEN ?? 'accesstokenrahasia', {
            expiresIn: 3600 * 3
        })

        return {
            accessToken
        }
    };
}