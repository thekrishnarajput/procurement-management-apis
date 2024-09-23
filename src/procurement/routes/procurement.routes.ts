import { Router } from "express";
import { validations } from "../../utils/middlewares/validationHandler";

import { Roles } from "../../utils/common/enums/roles";
import { permit } from "../../utils/middlewares/permissionHandler";
import { auth } from "../../utils/middlewares/token";
import { deleteProcurementController, getAllProcurementsController, getProcurementController, procurementLoginController, registerProcurementController, updateProcurementController } from "../controllers/procurement.controller";
// import upload from "../../utils/middlewares/upload";

export const procurementRouter = Router();

// Manager login
procurementRouter.post("/login",
    validations(["email", "password",]),
    procurementLoginController);

/* Using auth middleware globally for below routes */
procurementRouter.use(auth);

// Register procurement manager
procurementRouter.post("/register",
    validations(["name", "email", "mobileNumber", "password",]),
    registerProcurementController);

procurementRouter.post("/update-procurement-manager",
    permit([Roles.procurementManagerRoleId, Roles.adminRoleId]), // Procurement manager and admin both can perform this task
    updateProcurementController);

procurementRouter.post("/delete-procurement-manager",
    permit([Roles.adminRoleId]), // Admin can perform this task
    deleteProcurementController);

procurementRouter.get("/get-procurement-manager",
    permit([Roles.adminRoleId]), // Admin can perform this task
    validations(["_id"]),
    getProcurementController);

procurementRouter.get("/get-all-procurement-managers",
    permit([Roles.adminRoleId]), // Admin can perform this task
    getAllProcurementsController);