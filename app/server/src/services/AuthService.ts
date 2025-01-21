import { PrismaClient } from "@prisma/client";
import { InvariantError, NotFoundError } from "../common/exception";
import { IInstitution, RegisterPayloadType } from "../types/auth";


export class AuthService {
    constructor(public prismaClient: PrismaClient, public bcrypt: any, public jwt: any) {
    }

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

    async registerForInstitution(payload: IInstitution & { username: string, password: string, roleId: number }, institutionType: 1 | 2) {
        const isUserExistsOnDatabase = await this.isUserExistsOnDatabase(payload.username, payload.email);
        if (isUserExistsOnDatabase) {
            throw new InvariantError('User already exists');
        }

        const userInstitution = await this.prismaClient.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: payload.password,
                role_id: payload.roleId,
                is_verified: false,
                institution: {
                    create: {
                        name: payload.name,
                        address: payload.address,
                        phone_number: payload.phone,
                        email: payload.email,
                        head_name: payload.headName,
                        head_nip: payload.headNIP,
                        license_document: payload.licenseDocument,
                        institution_type: {
                            connect: {
                                id: institutionType
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

        return userInstitution;
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
            throw new InvariantError('Password is incorrect');
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
}