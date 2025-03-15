import express, { Request, Response } from "express";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { FamilyService } from "../services/FamilyService";
import { prismaDBClient } from "../../config/prisma";
import { FamilyController } from "../controllers/FamilyController";
import { multerMiddleware } from "../middlewares/MulterMiddleware";
import { validateFormDataMiddleware } from "../middlewares/ValidateFormData";
import { addMemberSchemaV2 } from "../common/http/requestvalidator/FamilyValidator";

const familyService = new FamilyService(prismaDBClient);

const familyController = new FamilyController(familyService);

export const familyRouter = express.Router();
familyRouter.put(
  "/:familyId?",
  AuthorizationMiddleware(["admin", "parent"]),
  (req: Request, res: Response) => {
    familyController.createOrUpdateFamily(req, res);
  }
);

familyRouter.post(
  "/:familyId/members",
  AuthorizationMiddleware([]),
  multerMiddleware.single("avatar"),
  (req: Request, res: Response) => {
    familyController.addFamilyMember(req, res);
  }
);

familyRouter.post(
  "/",
  AuthorizationMiddleware(["admin", "parent"]),
  (req: Request, res: Response) => {
    familyController.createFamilyWithMembers(req, res);
  }
);

familyRouter.get(
  "/:familyId/wages",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.getTotalGaji(req, res);
  }
);

familyRouter.get(
  "/:familyId/members/:familyMemberId/wages",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.getWageScoreOfFamilyMember(req, res);
  }
);

familyRouter.get(
  "/members/:familyMemberId/children",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.getChildrenScore(req, res);
  }
);

familyRouter.get(
  "/:familyId/members",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.getFamilyMembers(req, res);
  }
);

familyRouter.get(
  "/:familyId/members/:familyMemberId",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.getFamilyMember(req, res);
  }
);

familyRouter.get(
  "/head/:headName/members",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.getFamilyMemberByHeadName(req, res);
  }
);

familyRouter.get(
  "/head/phone/:phoneNumber/members",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.getFamilyMembersByHeadPhoneNumber(req, res);
  }
);

// V2

familyRouter.put(
  "/v2/members/:familyId?",
  AuthorizationMiddleware([]),
  multerMiddleware.single("avatar"),
  (req: Request, res: Response) => {
    familyController.AddFamilyMemberV2(req, res);
  }
);

familyRouter.put(
  "/v2/members/:memberId/schools/:schoolId/enroll",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.addMemberToSchool(req, res);
  }
);

familyRouter.put(
  "/v2/members/:memberId/profile",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    familyController.updateMember(req, res);
  }
);

familyRouter.put(
  "/v2/members/:memberId/avatar",
  AuthorizationMiddleware([]),
  multerMiddleware.single("avatar"),
  (req: Request, res: Response) => {
    familyController.updateAvatarMember(req, res);
  }
);
