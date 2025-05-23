import express, { Request, Response } from "express";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { UserService } from "../services/UserService";
import { UserController } from "../controllers/UserController";
import { prismaDBClient } from "../../config/prisma";
import { AuthService, EmailService } from "../services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userService = new UserService(prismaDBClient);
const authService = new AuthService(
  prismaDBClient,
  bcrypt,
  jwt,
  {} as EmailService
);
const userController = new UserController(userService, authService);

export const userRouter = express.Router();

userRouter.get(
  "/email/:email",
  AuthorizationMiddleware(["admin", "school"]),
  (req: Request, res: Response) => {
    userController.getUserByEmail(req, res);
  }
);

userRouter.get(
  "/username/:username",
  AuthorizationMiddleware(["admin", "school"]),
  (req: Request, res: Response) => {
    userController.getUserByUsername(req, res);
  }
);

userRouter.get(
  "/:id",
  AuthorizationMiddleware(["admin", "school"]),
  (req: Request, res: Response) => {
    userController.getUserById(req, res);
  }
);

userRouter.get(
  "/",
  AuthorizationMiddleware(["admin", "school"]),
  (req: Request, res: Response) => {
    userController.getUsers(req, res);
  }
);

userRouter.get(
  "/with-relation/:uniqueValue",
  AuthorizationMiddleware(["admin", "school"]),
  (req: Request, res: Response) => {
    userController.getUserWithRelation(req, res);
  }
);

userRouter.get(
  "/statistics/register",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    userController.getUserRegisterStatistic(req, res);
  }
);

userRouter.delete(
  "/:id",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    userController.deleteUser(req, res);
  }
);

userRouter.put(
  "/:id",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    userController.updateUserById(req, res);
  }
);
