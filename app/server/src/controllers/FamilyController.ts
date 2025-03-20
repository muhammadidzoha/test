import { Request, Response } from "express";
import { InvariantError } from "../common/exception";
import { handleError, validatePayload } from "../common/http";
import {
  addMemberSchema,
  addMemberSchemaV2,
  addMemberSchemaV3,
  createFamilySchema,
  updateMemberSchema,
} from "../common/http/requestvalidator/FamilyValidator";
import { FamilyService } from "../services/FamilyService";
import { IFamily, IFamilyMember, IMember } from "../types/family";

export class FamilyController {
  constructor(public familyService: FamilyService) {}

  async createOrUpdateFamily(req: Request, res: Response) {
    try {
      validatePayload(createFamilySchema, req.body);
      const { familyId } = req.params;
      const familyPayload: IFamily = req.body;
      const { family } = await this.familyService.createOrUpdateFamily(
        familyId ? +familyId : undefined,
        familyPayload
      );

      res.status(201).json({
        status: "Success",
        msesage: "Family created successfully",
        data: family,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async addFamilyMember(req: Request, res: Response) {
    try {
      validatePayload(addMemberSchema, req.body);
      const { familyId } = req.params;
      if (!familyId) {
        throw new InvariantError(
          "Family id is required in params to add member"
        );
      }

      const user = (req as any).user;
      const payload: IFamilyMember = req.body;
      const { familyMember } = await this.familyService.addFamilyMember(
        +familyId,
        { ...payload, birthDate: new Date(payload.birthDate) },
        user.id
      );

      res.status(201).json({
        status: "Success",
        message: "Family member added successfully",
        data: {
          familyMember: {
            ...familyMember,
            job: {
              ...familyMember.job,
              income: familyMember.job.income.toString(),
            },
          },
        },
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async AddFamilyMemberV2(req: Request, res: Response) {
    try {
      // validatePayload(addMemberSchemaV2, req.body);
      const { familyId } = req.params;

      const user = (req as any).user;
      const payload: IFamilyMember & { residenceId?: number } = req.body;
      if (payload.relation === "ANAK" && !payload.nutrition.birth_weight) {
        throw new InvariantError("Birth weight is required for children");
      }
      const { familyMember } = await this.familyService.addFamilyMemberV2(
        !!familyId ? +familyId : undefined,
        {
          ...payload,
          birthDate: new Date(payload.birthDate),
          residence: {
            ...payload.residence,
            ...(payload.residenceId && {
              id: payload.residenceId ? payload.residenceId : undefined,
            }),
          },
        },
        user.id
      );

      res.status(201).json({
        status: "Success",
        message: familyId
          ? "Family member updated successfully"
          : "Family member added successfully",
        data: {
          familyMember: {
            ...familyMember,
            job: {
              ...familyMember.job,
              income: familyMember.job.income.toString(),
            },
          },
        },
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async createFamilyWithMembers(req: Request, res: Response) {
    try {
      validatePayload(addMemberSchemaV3, req.body);
      const user = (req as any).user;
      const { members } = req.body;
      const { familyMembers } = await this.familyService.createFamilyWithMember(
        members,
        user.id
      );
      res.status(201).json({
        status: "Success",
        message: "Family created successfully",
        data: familyMembers,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getTotalGaji(req: Request, res: Response) {
    try {
      const { familyId } = req.params;
      if (!familyId) {
        throw new InvariantError(
          "Family id is required in params to get total gaji"
        );
      }
      const { umr } = req.query;
      if (!umr) {
        throw new InvariantError(
          "UMR is required in query params to get total gaji"
        );
      }
      const { categoryScore, totalFamily, totalGaji } =
        await this.familyService.getTotalGajiWithCategory(+familyId, +umr);
      res.status(200).json({
        status: "Success",
        message: "Total gaji fetched successfully",
        data: {
          totalGaji,
          totalFamily,
          score: categoryScore,
        },
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getWageScoreOfFamilyMember(req: Request, res: Response) {
    try {
      const { familyId, familyMemberId } = req.params;
      if (!familyId || !familyMemberId) {
        throw new InvariantError(
          "Family id and family member id is required in params to get wage score"
        );
      }
      const { umr } = req.query;
      if (!umr) {
        throw new InvariantError(
          "UMR is required in query params to get wage score"
        );
      }
      const { job, jobScore, wage, wageScore, familyMember } =
        await this.familyService.getWageScoreOfFamilyMember(
          +familyId,
          +familyMemberId,
          +umr
        );
      res.status(200).json({
        status: "Success",
        message: "Wage score fetched successfully",
        data: {
          familyMember,
          wage,
          wageScore,
          job,
          jobScore,
        },
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getChildrenScore(req: Request, res: Response) {
    try {
      const { familyMemberId } = req.params;
      if (!familyMemberId) {
        throw new InvariantError(
          "Family member id is required in params to get children score"
        );
      }
      const childrenScore = await this.familyService.getChildrenScore(
        +familyMemberId
      );
      res.status(200).json({
        status: "Success",
        message: "Children score fetched successfully",
        data: childrenScore,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getFamilyMembers(req: Request, res: Response) {
    try {
      const { familyId } = req.params;
      if (!familyId) {
        throw new InvariantError(
          "Family id is required in params to get family members"
        );
      }
      const familyMembers = await this.familyService.getFamilyMembers(
        +familyId
      );
      res.status(200).json({
        status: "Success",
        message: "Family members fetched successfully",
        data: familyMembers,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getFamilyMember(req: Request, res: Response) {
    try {
      const { familyId, familyMemberId } = req.params;
      if (!familyId || !familyMemberId) {
        throw new InvariantError(
          "Family id and family member id is required in params to get family member"
        );
      }
      const familyMember = await this.familyService.getFamilyMember(
        +familyId,
        +familyMemberId
      );
      res.status(200).json({
        status: "Success",
        message: "Family member fetched successfully",
        data: familyMember,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getFamilyMemberByHeadName(req: Request, res: Response) {
    try {
      const { headName } = req.params;
      if (!headName) {
        throw new InvariantError(
          "headName is required in params to get family member by head name"
        );
      }
      const { familyMembers } =
        await this.familyService.getFamilyMembersByHeadName(headName);
      res.status(200).json({
        status: "Success",
        message: "Family member fetched successfully",
        data: familyMembers,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getFamilyMembersByHeadPhoneNumber(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.params;
      if (!phoneNumber) {
        throw new InvariantError(
          "phoneNumber is required in params to get family member by head phone number"
        );
      }
      const { familyMembers } =
        await this.familyService.getFamilyMemberByHeadPhoneNumber(phoneNumber);
      res.status(200).json({
        status: "Success",
        message: "Family member fetched successfully",
        data: familyMembers,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async addMemberToSchool(req: Request, res: Response) {
    try {
      const { memberId, schoolId } = req.params;
      if (!memberId || !schoolId) {
        throw new InvariantError("memberId and schoolId is required in params");
      }
      const { updatedMember } = await this.familyService.addMemberToSchool(
        +memberId,
        +schoolId
      );

      res.status(200).json({
        status: "Success",
        message: "Member is added to a school",
        data: updatedMember,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateMember(req: Request, res: Response) {
    try {
      validatePayload(updateMemberSchema, req.body);
      const { memberId } = req.params;
      if (!memberId) {
        throw new InvariantError("memberId is required in params");
      }
      const payload: IMember = req.body;

      const { updatedMember } = await this.familyService.updateMember(
        +memberId,
        {
          ...payload,
        }
      );
      res.status(200).json({
        status: "Success",
        message: "Member updated",
        data: updatedMember,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateAvatarMember(req: Request, res: Response) {
    try {
      const { memberId } = req.params;
      if (!memberId) {
        throw new InvariantError("memberId is required in params");
      }
      const file = req.file;
      if (!file) {
        throw new InvariantError("avatar is required");
      }
      const { updatedMember } = await this.familyService.editAvatar(
        +memberId,
        file.filename
      );
      res.status(200).json({
        status: "Success",
        message: "Avatar updated successfully",
        data: updatedMember,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getFamilyMembersBelongToUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const { familyMembers } =
        await this.familyService.getFamilyMemberBelongToUser(user.id);

      res.status(200).json({
        status: "Success",
        message: "Family members retrieved",
        data: familyMembers,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getMemberLogin(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      console.log({user})

      const { member }  = await this.familyService.getMemberLogin(user.id);

      res.status(200).json({
        status: "Success",
        message: "Family members retrieved",
        data: member,
      });
    
    } catch (err: any) {
      handleError(err, res);
    }
    
  }
}
