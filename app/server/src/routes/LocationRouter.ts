import express from "express";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { prismaDBClient } from "../../config/prisma";
import { LocationService } from "../services/LocationService";
import { LocationController } from "../controllers/LocationController";

export const locationRouter = express.Router();

const locationService = new LocationService(prismaDBClient);
const locationController = new LocationController(locationService);

// Province Routes
locationRouter.post("/provinces", AuthorizationMiddleware([]), (req, res) =>
  locationController.addProvince(req, res)
);

locationRouter.get("/provinces", (req, res) =>
  locationController.getProvinces(req, res)
);

locationRouter.get("/provinces/:id", (req, res) =>
  locationController.getProvinceById(req, res)
);

locationRouter.put(
  "/provinces/:id",
  AuthorizationMiddleware(["admin"]),
  (req, res) => locationController.updateProvinceById(req, res)
);

locationRouter.delete(
  "/provinces/:id",
  AuthorizationMiddleware(["admin"]),
  (req, res) => locationController.deleteProvinceById(req, res)
);

// City Routes
locationRouter.post(
  "/provinces/:provinceId/cities",
  AuthorizationMiddleware(["admin"]),
  (req, res) => locationController.addCity(req, res)
);

locationRouter.get("/provinces/:provinceId/cities", (req, res) =>
  locationController.getCities(req, res)
);

locationRouter.get("/provinces/:provinceId/cities/:id", (req, res) =>
  locationController.getCityById(req, res)
);

locationRouter.put(
  "/provinces/:provinceId/cities/:id",
  AuthorizationMiddleware(["admin"]),
  (req, res) => locationController.updateCityById(req, res)
);

locationRouter.delete(
  "/cities/:id",
  AuthorizationMiddleware(["admin"]),
  (req, res) => locationController.deleteCityById(req, res)
);

export default locationRouter;
