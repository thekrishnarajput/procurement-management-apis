import { Router } from "express";
import { adminLoginController } from "../controllers/admin.controller";
import { validations } from "../../utils/middlewares/validationHandler";

export const adminRouter = Router();

// Admin login route
adminRouter.post("/login",
    validations(["email", "adminPassword"]),
    adminLoginController);