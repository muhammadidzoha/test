import cors from "cors";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import express, { Request, Response } from "express";
import { prismaDBClient } from "../config/prisma";
import { SeedService } from "./services/SeedService";
dotenvExpand.expand(dotenv.config());

// route
import { authRouter } from "./routes/AuthRouter";
import { familyRouter } from "./routes/FamilyRouter";
import { institutionRouter } from "./routes/InstitutionRouter";
import { interventionRouter } from "./routes/InterventionRouter";
import { kieRouter } from "./routes/KIERouter";
import { memberRouter } from "./routes/MemberRouter";
import { quisionerRouter } from "./routes/QuisionerRouter";
import { uksRouter } from "./routes/UKSRouter";
import { userRouter } from "./routes/UserRouter";
import { nutritionRouter } from "./routes/NutritionRouter";
import locationRouter from "./routes/LocationRouter";

// Middleware

const seedService = new SeedService(prismaDBClient);

const init = async () => {
  const port = process.env.API_PORT ? +process.env.API_PORT : 5000;
  await seedService.seed();
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/public", express.static("uploads"));

  app.use("/auth", authRouter);
  app.use("/institutions", institutionRouter);
  app.use("/families", familyRouter);
  app.use("/users", userRouter);
  app.use("/members", memberRouter);
  app.use("/health-care", uksRouter);
  app.use("/kie", kieRouter);
  app.use("/interventions", interventionRouter);
  app.use("/quisioners", quisionerRouter);
  app.use("/nutritions", nutritionRouter);
  app.use("/locations", locationRouter);

  app.get("/", (req: Request, res: Response) => {
    res.send("ok");
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

init();
