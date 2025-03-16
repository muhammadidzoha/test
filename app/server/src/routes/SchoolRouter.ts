import express, { Request, Response } from "express";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { multerMiddleware } from "../middlewares/MulterMiddleware";
import { SchoolService } from "../services";
import { prismaDBClient } from "../../config/prisma";
import { SchoolController } from "../controllers/SchoolController";
import { AuthService } from "../services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailService } from "../services";
import { NutritionService } from "../services/NutritionService";

const emailService = new EmailService();
const authService = new AuthService(prismaDBClient, bcrypt, jwt, emailService);
const schoolService = new SchoolService(prismaDBClient, authService);
const nutritionService = new NutritionService(prismaDBClient);

const schoolController = new SchoolController(schoolService, nutritionService);

export const schoolRouter = express.Router();

// School
schoolRouter.get("/", AuthorizationMiddleware([]), (req, res) => {
  schoolController.getAllSchools(req, res);
});

schoolRouter.get("/:schoolId", AuthorizationMiddleware([]), (req, res) => {
  schoolController.getSchoolById(req, res);
});

schoolRouter.get(
  "/:schoolId/students",
  AuthorizationMiddleware([]),
  (req, res) => {
    schoolController.getStudentsBelongToSchool(req, res);
  }
);

schoolRouter.post(
  "/",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    schoolController.addSchool(req, res);
  }
);

schoolRouter.put("/:schoolId", AuthorizationMiddleware([]), (req, res) => {
  schoolController.updateSchool(req, res);
});

// CLASSES
schoolRouter.post(
  "/classes/",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.createClass(req, res);
  }
);

schoolRouter.get(
  "/classes/all",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.getClasses(req, res);
  }
);

schoolRouter.delete(
  "/classes/:classId",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    schoolController.deleteClassById(req, res);
  }
);

// Class Categories
schoolRouter.post(
  "/categories",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.createCategories(req, res);
  }
);

schoolRouter.get(
  "/categories/all",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.getCategories(req, res);
  }
);

schoolRouter.delete(
  "/categories/:categoryId",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    schoolController.deleteCategoryById(req, res);
  }
);

// Category On Class

schoolRouter.get(
  "/:schoolId/classes-categories",
  AuthorizationMiddleware(["admin", "parent", "school", "teacher"]),
  (req: Request, res: Response) => {
    schoolController.getClassesWithCategoriesBelongToSchool(req, res);
  }
);

schoolRouter.post(
  "/:schoolId/classes/:classId/categories",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.connectCategoryToClass(req, res);
  }
);

// Student
schoolRouter.post(
  "/:schoolId/students/:studentId/classes",
  AuthorizationMiddleware(["admin", "teacher", "school", "parent"]),
  (req: Request, res: Response) => {
    schoolController.addStudent(req, res);
  }
);

schoolRouter.put(
  "/:schoolId/students/:studentId/class/:baseClassId",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.updateEnrolledStudent(req, res);
  }
);

// Teacher

schoolRouter.get(
  "/teachers/all",
  AuthorizationMiddleware(["admin"]),
  (req: Request, res: Response) => {
    schoolController.getTeachers(req, res);
  }
);

schoolRouter.get(
  "/teachers/:teacherId",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.getTeacherById(req, res);
  }
);

schoolRouter.get(
  "/:schoolId/teachers",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.getTeachersBelongToSchool(req, res);
  }
);

schoolRouter.post(
  "/:schoolId/teachers",
  AuthorizationMiddleware(["admin", "school"]),
  multerMiddleware.single("avatar"),
  (req: Request, res: Response) => {
    schoolController.addTeacher(req, res);
  }
);

schoolRouter.post(
  "/:schoolId/classes/:classId/teacher",
  AuthorizationMiddleware(["admin", "school"]),
  (req: Request, res: Response) => {
    schoolController.enrolledTeacherToClass(req, res);
  }
);

schoolRouter.delete(
  "/:schoolId/students/:studentId",
  AuthorizationMiddleware(["admin", "school"]),
  (req: Request, res: Response) => {
    schoolController.deleteStudentById(req, res);
  }
);

// Health Education

schoolRouter.put(
  "/:schoolId/health-education",
  AuthorizationMiddleware(["school", "admin"]),
  (req, res) => {
    schoolController.createOrUpdateHealthEducation(req, res);
  }
);

// Health Service
schoolRouter.put(
  "/:schoolId/health-service",
  AuthorizationMiddleware(["school", "admin"]),
  (req, res) => {
    schoolController.createOrUpdateHealthService(req, res);
  }
);

// School Environment
schoolRouter.put(
  "/:schoolId/school-environment",
  AuthorizationMiddleware(["school", "admin"]),
  (req, res) => {
    schoolController.createOrUpdateSchoolEnvironment(req, res);
  }
);

// UKS MANAGEMENT QUISIONER
schoolRouter.put(
  "/:schoolId/uks-quisioner",
  AuthorizationMiddleware(["school", "admin"]),
  (req, res) => {
    schoolController.createOrUpdateUKSManagementQuisioner(req, res);
  }
);

// Health Care (UKS)
schoolRouter.put(
  "/:schoolId/health-care",
  AuthorizationMiddleware(["school", "admin"]),
  (req, res) => {
    schoolController.createOrUpdateHealthCare(req, res);
  }
);

schoolRouter.post(
  "/:schoolId/health-care/:healthCareId/member",
  AuthorizationMiddleware(["admin", "school"]),
  (req, res) => {
    schoolController.addHealthCareMember(req, res);
  }
);

schoolRouter.get(
  "/:schoolId/stratifications",
  AuthorizationMiddleware(["school", "admin", "uks", "healthcare"]),
  (req, res) => {
    schoolController.getAllSchoolStratification(req, res);
  }
);

// Facility
schoolRouter.post(
  "/:schoolId/facilities",
  AuthorizationMiddleware(["school", "admin", "uks"]),
  (req, res) => {
    schoolController.createFacility(req, res);
  }
);

schoolRouter.get(
  "/:schoolId/facilities",
  AuthorizationMiddleware([]),
  (req, res) => {
    schoolController.getFacilityOwnedBySchool(req, res);
  }
);

schoolRouter.get(
  "/:schoolId/facilities/:facilityId",
  AuthorizationMiddleware([]),
  (req, res) => {
    schoolController.getFacilityById(req, res);
  }
);

schoolRouter.delete(
  "/:schoolId/facilities/:facilityId",
  AuthorizationMiddleware(["school", "admin", "uks"]),
  (req, res) => {
    schoolController.deleteFacility(req, res);
  }
);

schoolRouter.put(
  "/:schoolId/facilities/:facilityId",
  AuthorizationMiddleware(["school", "admin", "uks"]),
  (req, res) => {
    schoolController.updateFacility(req, res);
  }
);

// Nutrition
schoolRouter.get(
  "/:schoolId/nutritions",
  AuthorizationMiddleware([]),
  (req, res) => {
    schoolController.getStudentLatestNutrition(req, res);
  }
);

schoolRouter.get(
  "/stats/nutritions/all",
  AuthorizationMiddleware([]),
  (req: Request, res: Response) => {
    schoolController.getNutritionStatistics(req, res);
  }
);
schoolRouter.get(
  "/:schoolId/stats/nutritions/families",
  AuthorizationMiddleware(["parent"]),
  (req: Request, res: Response) => {
    schoolController.getNutritionStatisticsFromFamily(req, res);
  }
);

schoolRouter.get(
  "/:schoolId/students/sicks/:nutritionStatusId",
  AuthorizationMiddleware([]),
  (req, res) => {
    schoolController.getSickStudents(req, res);
  }
);

// Stratification
schoolRouter.get(
  "/:schoolId/stratifies",
  AuthorizationMiddleware([]),
  (req, res) => {
    schoolController.getStratifiedSchool(req, res);
  }
);

schoolRouter.get(
  "/:schoolId/stratifies/stratification",
  AuthorizationMiddleware([]),
  (req, res) => {
    schoolController.getStratifiedSchoolByType(req, res);
  }
);
