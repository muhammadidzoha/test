import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { handleError } from "../common/http";
import { InvariantError, NotFoundError } from "../common/exception";

export class UserController {
    constructor(public userService: UserService) { }

    async getUserByUniqueIdentity(req: Request, res: Response) {
        try {
            const { uniqueIdentity } = req.params;
            if (!uniqueIdentity) {
                throw new InvariantError('Unique identity is required to get user');
            }

            const { user } = await this.userService.getUserByUniqueIdentity(uniqueIdentity);
            if (!user) {
                throw new NotFoundError('User not Found');
            }
            res.status(200).json({
                status: 'Success',
                message: 'User retrieved',
                data: user
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getUserByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params;

            if (!username) {
                throw new InvariantError('Username is required to get user');
            }
            const { user } = await this.userService.getUserByUsername(username);

            res.status(200).json({
                status: 'Success',
                message: `User ${username} retrieved`,
                data: user
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        try {
            const { email } = req.params;
            if (!email) {
                throw new InvariantError('Email is required to get user');
            }
            const { user } = await this.userService.getUserByEmail(email);

            res.status(200).json({
                status: 'Success',
                message: `User ${email} retrieved`,
                data: user
            })

        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new InvariantError('Id is required to get user');
            };
            const { user } = await this.userService.getUserById(+id);

            res.status(200).json({
                status: 'Success',
                message: 'User retrieved',
                data: user
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const { users } = await this.userService.getUsers();

            res.status(200).json({
                status: 'Success',
                message: 'Users retrieved',
                data: users
            })

        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getUserWithRelation(req: Request, res: Response) {
        try {
            const query = req.query;
            const { uniqueValue } = req.params;

            const mappedQuery = Object.keys(query).reduce((acc: any, key) => {
                return { ...acc, [key]: !!query[key] }
            }, {})
            console.log({ mappedQuery, query });
            console.log(query['family_member'])

            const { user } = await this.userService.getUserWithRelation(uniqueValue, mappedQuery);

            res.status(200).json({
                status: 'Success',
                message: 'User retrieved',
                data: user
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }

    async getUserRegisterStatistic(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const { stats } = await this.userService.getUserRegisterStatistic();

            res.status(200).json({
                status: 'Success',
                message: 'User register statistic retrieved',
                data: stats
            })
        } catch (err: any) {
            handleError(err, res);
        }
    }
}