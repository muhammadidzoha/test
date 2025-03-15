import { Request, Response } from "express";
import { LocationService } from "../services/LocationService";
import { handleError } from "../common/http";
import { InvariantError } from "../common/exception";

export class LocationController {
  constructor(private locationService: LocationService) {}

  async addProvince(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const { province } = await this.locationService.addProvince(name);
      res.status(201).json({
        status: "Success",
        message: `Province ${name} created successfully`,
        data: province,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getProvinces(req: Request, res: Response) {
    try {
      const { name } = req.query;
      const { provinces } = await this.locationService.getProvinces(
        name as string
      );
      res.status(200).json({
        status: "Success",
        data: provinces,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getProvinceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { province } = await this.locationService.getProvinceById(+id);
      res.status(200).json({
        status: "Success",
        message: "Province retrieved",
        data: province,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateProvinceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const { province } = await this.locationService.updateProvinceById(
        Number(id),
        name
      );
      res.status(200).json({
        status: "Success",
        message: `Province ${id} updated successfully`,
        data: province,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async deleteProvinceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.locationService.deleteProvinceById(Number(id));
      res.status(200).json({
        status: "Success",
        message: `Province ${id} deleted successfully`,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async addCity(req: Request, res: Response) {
    try {
      const { provinceId } = req.params;
      if (!provinceId) {
        throw new InvariantError("provinceId is required in params");
      }
      const { name } = req.body;
      const { city } = await this.locationService.addCity(name, +provinceId);
      res.status(201).json({
        status: "Success",
        message: `City ${name} created successfully`,
        data: city,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getCities(req: Request, res: Response) {
    try {
      const { name } = req.query;
      const { cities } = await this.locationService.getCities(name as string);
      res.status(200).json({
        status: "Success",
        data: cities,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async updateCityById(req: Request, res: Response) {
    try {
      const { provinceId } = req.params;
      if (!provinceId) {
        throw new InvariantError("provinceId is required in params");
      }
      const { id } = req.params;
      const { name } = req.body;
      const { city } = await this.locationService.updateCityById(+id, {
        name,
        provinceId: +provinceId,
      });
      res.status(200).json({
        status: "Success",
        message: `City ${id} updated successfully`,
        data: city,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async deleteCityById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.locationService.deleteCityById(Number(id));
      res.status(200).json({
        status: "Success",
        message: `City ${id} deleted successfully`,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }

  async getCityById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { city } = await this.locationService.getCityById(+id);
      res.status(200).json({
        status: "Success",
        message: "Province retrieved",
        data: city,
      });
    } catch (err: any) {
      handleError(err, res);
    }
  }
}
