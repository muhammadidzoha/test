import { Request, Response } from "express";
import { InvariantError, NotFoundError } from "../common/exception";
import { handleError, validatePayload } from "../common/http";
import {
  addHealthCareMemberSchema,
  CreateHealthCareSchema,
} from "../common/http/requestvalidator/HealhCareValidator";
import { HealthEducationSchema } from "../common/http/requestvalidator/HealthEducationValidator";
import { HealthServiceSchema } from "../common/http/requestvalidator/HealthServiceValidator";
import { schoolEnvironmentSchema } from "../common/http/requestvalidator/SchoolEnvironmentValidator";
import {
  addSchoolSchema,
  addStudentSchema,
  connectCategoryOnClassSchema,
  createCategorySchema,
  createClassSchema,
  createFacilitySchema,
  createSchoolSchema,
  createUKSQuisionerSchema,
  enrolledTeacherSchema,
} from "../common/http/requestvalidator/SchoolValidator";
import { SchoolService } from "../services/SchoolService";
import {
  IFacility,
  IHealthCare,
  IHealthEducation,
  IHealthServicePayload,
} from "../types/school";
import { NutritionService } from "../services/NutritionService";

export class SchoolController {
  constructor(
    public schoolService: SchoolService,
    public nutritionService: NutritionService
  ) {}

  async createOrUpdateHealthEducation(req: Request, res: Response) {
    try {
      validatePayload(HealthEducationSchema, req.body);
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }

      console.log({ schoolId });

      const reqPayload: IHealthEducation = req.body;

      const { healthEducation } =
        await this.schoolService.createOrUpdateHealthEducation(
          +schoolId,
          reqPayload
        );

      res.status(201).json({
        status: "Success",
        message: `Health Education for School ${schoolId} is Created or Updated`,
        data: healthEducation,
      });
    } catch (err) {
      handleError(err, res);
    }
  }

  async createOrUpdateHealthService(req: Request, res: Response) {
    try {
      validatePayload(HealthServiceSchema, req.body);
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }

      const payload: IHealthServicePayload = req.body;
      const { healthService } =
        await this.schoolService.createOrUpdateHealthServices(
          +schoolId,
          payload
        );
      res.status(201).json({
        status: "Success",
        message: `Health Service for School ${schoolId} is Created or Updated`,
        data: healthService,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async createOrUpdateSchoolEnvironment(req: Request, res: Response) {
    try {
      validatePayload(schoolEnvironmentSchema, req.body);
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }

      const payload = req.body;
      const { schoolEnvironment } =
        await this.schoolService.createOrUpdateSchoolEnvironment(
          +schoolId,
          payload
        );
      res.status(201).json({
        status: "Success",
        message: `School Environment for School ${schoolId} is Created or Updated`,
        data: schoolEnvironment,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async createOrUpdateHealthCare(req: Request, res: Response) {
    try {
      validatePayload(CreateHealthCareSchema, req.body);
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const user = (req as any).user;
      const payload: IHealthCare = req.body;

      const { healthCare } = await this.schoolService.createOrUpdateHealthCare(
        +schoolId,
        payload,
        user.email
      );
      res.status(201).json({
        status: "Success",
        message: `Health Care for School ${schoolId} is Created or Updated`,
        data: healthCare,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async addHealthCareMember(req: Request, res: Response) {
    try {
      validatePayload(addHealthCareMemberSchema, req.body);
      const { healthCareId } = req.params;
      if (!healthCareId) {
        throw new InvariantError(
          "School Id and Health Care Id is required in Parameter"
        );
      }

      const { name, positionId, userId } = req.body;
      const { healthCareMember } = await this.schoolService.addHealthCareMember(
        { healthCareId: +healthCareId, name, positionId, userId }
      );

      res.status(201).json({
        status: "Success",
        message: "Health Care Member is added",
        data: healthCareMember,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async createFacility(req: Request, res: Response) {
    try {
      validatePayload(createFacilitySchema, req.body);
      const { schoolId } = req.params;
      const payload: IFacility & { facilityTypeId: number } = req.body;

      const { facility } = await this.schoolService.createFacility(
        +schoolId,
        payload,
        +payload.facilityTypeId
      );

      res.status(201).json({
        status: "Success",
        message: "Facility is created",
        data: facility,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getFacilityOwnedBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }

      const { facilities } = await this.schoolService.getFacilityBySchoolId(
        +schoolId
      );

      res.status(200).json({
        status: "Success",
        message: "Facilities owned by School",
        data: facilities,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getFacilityById(req: Request, res: Response) {
    try {
      const { facilityId, schoolId } = req.params;
      if (!facilityId || !schoolId) {
        throw new InvariantError("Facility Id is required in Parameter");
      }
      const { facility } = await this.schoolService.getFacilityById(
        +facilityId,
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "Facility Data",
        data: facility,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async deleteFacility(req: Request, res: Response) {
    try {
      const { facilityId, schoolId } = req.params;
      if (!facilityId) {
        throw new InvariantError("Facility Id is required in Parameter");
      }
      const { facility } = await this.schoolService.deleteFacility(
        +facilityId,
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "Facility is deleted",
        data: facility,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateFacility(req: Request, res: Response) {
    try {
      validatePayload(createFacilitySchema, req.body);
      const { schoolId, facilityId } = req.params;
      if (!schoolId || !facilityId) {
        throw new InvariantError(
          "School Id and Facility Id is required in Parameter"
        );
      }
      const payload: IFacility & { facilityTypeId: number } = req.body;
      const { facility } = await this.schoolService.updateFacility(
        +facilityId,
        payload,
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "Facility is updated",
        data: facility,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getHealthCareBySchoolId(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { healthCare } = await this.schoolService.getHealthCareBySchoolId(
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "Health Care Data",
        data: healthCare,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getHealthServiceBySchoolId(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { healthService } = await this.schoolService.getHealthService(
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "Health Service Data",
        data: healthService,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async schoolEnvironment(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { schoolEnvironment } =
        await this.schoolService.getSchoolEnvironment(+schoolId);
      res.status(200).json({
        status: "Success",
        message: "School Environment Data",
        data: schoolEnvironment,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async createOrUpdateUKSManagementQuisioner(req: Request, res: Response) {
    try {
      validatePayload(createUKSQuisionerSchema, req.body);
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { uksQuisioner } =
        await this.schoolService.createOrUpdateUKSQuisioner(
          +schoolId,
          req.body
        );
      res.status(201).json({
        status: "Success",
        message: "UKS Management Data is Created or Updated",
        data: uksQuisioner,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getUKSManagementQuisioner(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { uksQuisioner } = await this.schoolService.getUKSQuisioner(
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "UKS Management Data",
        data: uksQuisioner,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getAllSchoolStratification(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { schoolStratification } =
        await this.schoolService.getSchoolStratifications(+schoolId);

      res.status(200).json({
        status: "Success",
        message: "School Stratification Data",
        data: schoolStratification,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getStudentLatestNutrition(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { studentNutritions } =
        await this.schoolService.getStudentLatestNutrition(+schoolId);
      res.status(200).json({
        status: "Success",
        message: "Student Nutrition Data",
        data: studentNutritions,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getSickStudents(req: Request, res: Response) {
    try {
      const { schoolId, nutritionStatusId } = req.params;
      if (!schoolId || !nutritionStatusId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { students } =
        await this.schoolService.getStudentWithNutritionStatus(
          +schoolId,
          +nutritionStatusId
        );
      res.status(200).json({
        status: "Success",
        message: "Sick Student Data",
        data: students,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getAllSchools(req: Request, res: Response) {
    try {
      const { schools } = await this.schoolService.getAllSchools();
      res.status(200).json({
        status: "Success",
        message: "School Data",
        data: schools,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getSchoolById(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const { school } = await this.schoolService.getSchoolById(+schoolId);
      if (!school) {
        throw new NotFoundError("School not found");
      }
      res.status(200).json({
        status: "Success",
        message: "School Data",
        data: school,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateSchool(req: Request, res: Response) {
    try {
      validatePayload(createSchoolSchema, req.body);
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const payload = req.body;
      const { school } = await this.schoolService.updateSchool(
        +schoolId,
        payload
      );
      res.status(200).json({
        status: "Success",
        message: "School Data Updated",
        data: school,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getStratifiedSchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("School Id is required in Parameter");
      }
      const stratifiedServices = await this.schoolService.getStratifiedSchool(
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "Stratified School Data",
        data: stratifiedServices,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getStratifiedSchoolByType(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const { stratification } = req.query;
      if (!schoolId || !stratification) {
        throw new InvariantError(
          "School Id and stratificationstratification is required in Parameter and query"
        );
      }
      const stratifiedServices =
        await this.schoolService.getServiceStratification(
          +schoolId,
          stratification as string
        );
      res.status(200).json({
        status: "Success",
        message: `Stratified School Data By ${stratification}`,
        data: stratifiedServices,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getStudentsBelongToSchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("schoolId is required in params");
      }
      const { students } = await this.schoolService.getStudentsBelongToSchool(
        +schoolId
      );
      res.status(200).json({
        status: "Success",
        message: "Students Retrieved",
        data: students,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async createClass(req: Request, res: Response) {
    try {
      validatePayload(createClassSchema, req.body);
      const { classNumbers }: { classNumbers: string[] } = req.body;
      const { createdClass } = await this.schoolService.createClass(
        classNumbers
      );

      res.status(201).json({
        status: "Success",
        message: "Class Created",
        data: createdClass,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getClasses(req: Request, res: Response) {
    try {
      const { classes } = await this.schoolService.getClasses();
      res.status(200).json({
        status: "Success",
        message: "Classes Retrieved",
        data: classes,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async deleteClassById(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const { deletedClass } = await this.schoolService.deleteClassById(
        +classId
      );
      res.status(200).json({
        status: "Success",
        message: "Class Deleted",
        data: deletedClass,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async createCategories(req: Request, res: Response) {
    try {
      validatePayload(createCategorySchema, req.body);
      const { classCategories } = req.body;
      const { createdCategory } = await this.schoolService.createCategories(
        classCategories
      );

      res.status(201).json({
        status: "Success",
        message: "Categories Created",
        data: createdCategory,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const { categories } = await this.schoolService.getCategories();

      res.status(201).json({
        status: "Success",
        message: "Categories Created",
        data: categories,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async deleteCategoryById(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const { deletedCategory } = await this.schoolService.deleteCategoryById(
        +categoryId
      );

      res.status(201).json({
        status: "Success",
        message: "Categories Created",
        data: deletedCategory,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async connectCategoryToClass(req: Request, res: Response) {
    try {
      validatePayload(connectCategoryOnClassSchema, req.body);
      const { schoolId, classId } = req.params;
      if (!schoolId || !classId) {
        throw new InvariantError(
          "School Id, classId and categoryId is needed in params"
        );
      }
      const { classCategoriesId } = req.body;
      await this.schoolService.createCategoryOnClass({
        classId: +classId,
        schoolId: +schoolId,
        categoriesId: classCategoriesId,
      });

      res.status(201).json({
        status: "Success",
        message: `Category connected to classId ${classId}`,
        data: {
          classId: +classId,
          categoriesId: classCategoriesId,
        },
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getClassesWithCategoriesBelongToSchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      if (!schoolId) {
        throw new InvariantError("classId and schoolId is required in params");
      }
      const { classesWithCategories } =
        await this.schoolService.getClassesWithCategoriesBelongToSchool(
          +schoolId
        );
      res.status(200).json({
        status: "Success",
        message: "Class with category retrieved",
        data: classesWithCategories,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async addStudent(req: Request, res: Response) {
    try {
      validatePayload(addStudentSchema, req.body);
      const { schoolId, studentId } = req.params;
      if (!schoolId || !studentId) {
        throw new InvariantError(
          "schoolId and studentId is required in params"
        );
      }
      const { schoolYear, semester, categoryOnClassId } = req.body;
      const { student } = await this.schoolService.addStudent({
        schoolId: +schoolId,
        semester,
        schoolYear,
        categoryOnClassId: categoryOnClassId,
        studentId: +studentId,
      });

      res.status(201).json({
        status: "Success",
        message: "student created",
        data: student,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async deleteStudentById(req: Request, res: Response) {
    try {
      const { studentId, schoolId } = req.params;
      if (!studentId) {
        throw new InvariantError("studentId is required in params");
      }

      const { student } = await this.schoolService.getStudentById(+studentId);
      if (!student) {
        throw new NotFoundError(`student with id ${studentId} is not found`);
      }
      await this.schoolService.checkIfStudentBelongToSchool(
        +studentId,
        +schoolId
      );
      await this.schoolService.deleteStudentById(+studentId);

      res.status(200).json({
        status: "Success",
        message: `Student with id ${studentId} is deleted`,
        data: student,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateEnrolledStudent(req: Request, res: Response) {
    try {
      const { schoolId, studentId, baseClassId } = req.params;
      if (!schoolId || !studentId) {
        throw new InvariantError(
          "schoolId and studentId is required in params"
        );
      }
      const { classId, schoolYear, semester } = req.body;
      if (!classId) {
        throw new InvariantError("classId is required in body");
      }
      if (!schoolYear) {
        throw new InvariantError("School Year is required in body");
      }
      if (!semester) {
        throw new InvariantError("semester is required in body");
      }

      const { updatedEnroll } = await this.schoolService.updateEnrolledStudent(
        +baseClassId,
        {
          schoolId: +schoolId,
          studentId: +studentId,
          semester,
          schoolYear,
          classCategoryOnClassId: classId,
        }
      );
      res.status(200).json({
        status: "Success",
        msesage: "Student updated",
        data: updatedEnroll,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async addTeacher(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;

      if (!schoolId) {
        throw new InvariantError("schoolId is required in params");
      }
      const { name, userId } = req.body;
      console.log({ name, userId });
      if (!name || !userId) {
        throw new InvariantError("Name or userId is required");
      }
      const file = req.file;

      const avatar = file?.filename;

      const { newTeacher } = await this.schoolService.addTeacher({
        name,
        userId: +userId,
        schoolId: +schoolId,
        avatar: avatar ?? undefined,
      });
      res.status(201).json({
        status: "Success",
        message: "Teacher is created",
        data: newTeacher,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async enrolledTeacherToClass(req: Request, res: Response) {
    try {
      validatePayload(enrolledTeacherSchema, req.body);
      const { schoolId, classId } = req.params;
      if (!schoolId || !classId) {
        throw new InvariantError("schoolId and classId is required in params");
      }
      const { schoolYear, teacherId } = req.body;
      const { enrolledTeacher } = await this.schoolService.enrollTeacherToClass(
        {
          classId: +classId,
          schoolId: +schoolId,
          schoolYear,
          teacherId,
        }
      );
      res.status(201).json({
        status: "Success",
        message: `Successfully enrolled teacher ${teacherId} to class ${classId}`,
        data: enrolledTeacher,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getTeachers(req: Request, res: Response) {
    try {
      const { teachers } = await this.schoolService.getTeachers();

      res.status(200).json({
        status: "Success",
        message: "Teachers retrieved",
        data: teachers,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getTeacherById(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      const { teacher } = await this.schoolService.getTeacherById(+teacherId);

      res.status(200).json({
        status: "Success",
        message: "Teachers retrieved",
        data: teacher,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getTeachersBelongToSchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.params;
      const { teachers } = await this.schoolService.getTeachersBelongToSchool(
        +schoolId
      );

      res.status(200).json({
        status: "Success",
        message: "Teachers retrieved",
        data: teachers,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async addSchool(req: Request, res: Response) {
    try {
      validatePayload(addSchoolSchema, req.body);
      const payload = req.body;
      const { newSchool } = await this.schoolService.addSchool({
        ...payload,
      });
      res.status(201).json({
        status: "Success",
        message: "School created",
        data: newSchool,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getNutritionStatistics(req: Request, res: Response) {
    try {
      const { statusTypeId } = req.query;
      const { statistic } = await this.nutritionService.getNutritionStatistics(
        statusTypeId ? +statusTypeId : 3
      );
      res.status(201).json({
        status: "Success",
        message: "Nutrition Statistic retrieves",
        data: statistic.map((stat) => ({
          ...stat,
          total: +stat.total.toString(),
        })),
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }
}
