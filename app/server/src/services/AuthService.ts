import { PrismaClient } from "@prisma/client";
import { InvariantError, NotFoundError } from "../common/exception";
import { IInstitution, IPayloadToken, RegisterPayloadType } from "../types/auth";
import { AuthenticationError } from "../common/exception/AuthenticationError";


export class AuthService {
    constructor(public prismaClient: PrismaClient, public bcrypt: any, public jwt: any) { }

    async register({
        username, email, password, roleId = 4, isVerified = false
    }: RegisterPayloadType): Promise<{
        newUser: {
            id: number;
            username: string;
            email: string;
            password: string;
            roleId: number;
            isVerified: boolean;
        }
    }> {
        const isUserExistsOnDatabase = await this.isUserExistsOnDatabase(username, email);

        if (isUserExistsOnDatabase) {
            throw new InvariantError('User already exists');
        }

        const newPassword = await this.bcrypt.hash(password, 10);

        const newUser = await this.prismaClient.user.create({
            data: {
                username,
                email,
                password: newPassword,
                role_id: roleId,
                is_verified: roleId === 4 ? true : isVerified
            },
        });

        return {
            newUser: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                roleId: newUser.role_id,
                isVerified: newUser.is_verified
            }
        }
    }

    async registerForInstitution(payload: IInstitution & Omit<RegisterPayloadType, 'isVerified'>) {
        const isUserExistsOnDatabase = await this.isUserExistsOnDatabase(payload.username, payload.email);
        if (isUserExistsOnDatabase) {
            throw new InvariantError('User already exists');
        }

        const newPassword = await this.bcrypt.hash(payload.password, 10);

        const userInstitution = await this.prismaClient.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: newPassword,
                role_id: payload.roleId,
                is_verified: false,
                institution: {
                    create: {
                        name: payload.name,
                        address: payload.address,
                        phone_number: payload.phoneNumber,
                        email: payload.email,
                        head_name: payload.headName,
                        head_nip: payload.headNIP,
                        license_document: payload.licenseDocument,
                        institution_type: {
                            connect: {
                                id: payload.roleId === 2 ? 1 : 2
                            }
                        }
                    }
                }
            },
            include: {
                institution: {
                    select: {
                        name: true,
                        address: true,
                        phone_number: true,
                        email: true,
                        head_name: true,
                        head_nip: true,
                        license_document: true,
                        institution_type: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        return {
            userInstitution
        }
    }



    async isUserExistsOnDatabase(username: string, email: string): Promise<boolean> {
        const userOnDatabase = await this.prismaClient.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        })
        return !!userOnDatabase;
    }

    async login(uniqueIdentity: string, password: string): Promise<{
        accessToken: string;
    }> {
        const userOnDatabase = await this.prismaClient.user.findFirst({
            where: {
                OR: [
                    { username: uniqueIdentity },
                    { email: uniqueIdentity }
                ]
            }
        })

        if (!userOnDatabase) {
            throw new NotFoundError('User not found');
        }

        const isPasswordMatch = await this.bcrypt.compare(password, userOnDatabase.password);
        if (!isPasswordMatch) {
            throw new AuthenticationError('Password is incorrect');
        }
        if (!userOnDatabase.is_verified) {
            throw new AuthenticationError('User not verified');
        }
        const userRole = await this.prismaClient.role.findUnique({
            where: {
                id: userOnDatabase.role_id
            }
        })

        const accessToken = this.jwt.sign({
            id: userOnDatabase.id,
            username: userOnDatabase.username,
            role: userRole?.name ?? 'parent'
        }, process.env.SECRET_ACCESS_TOKEN ?? 'accesstokenrahasia', {
            expiresIn: 3600 * 3
        })

        return {
            accessToken
        }
    };

    async getUserByUniqueIdentity(uniqueIdentity: string) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                OR: [
                    { username: uniqueIdentity },
                    { email: uniqueIdentity }
                ]
            }
        })

        if (!user) {
            throw new NotFoundError('User not found');
        }
        return {
            user
        }
    }

    async verifyEmail(token: string) {
        const decodedToken: IPayloadToken = this.jwt.verify(token, process.env.SECRET_ACCESS_TOKEN ?? 'secretaccesstoken');
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: decodedToken.id
            }
        })

        if (!user) {
            throw new NotFoundError('User not found');
        }
        if (!user.is_verified) {
            const updatedUser = await this.prismaClient.user.update({
                data: {
                    is_verified: true
                },
                where: {
                    id: decodedToken.id
                }
            })
            return { user: updatedUser, message: 'User Verified Successfully' }

        }

        return { user: null, message: 'User already verified' };
    }
}