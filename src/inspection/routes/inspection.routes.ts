import { Router } from "express";
import { validations, validator } from "../../utils/middlewares/validationHandler";

import { Roles } from "../../utils/common/enums/roles";
import { permit } from "../../utils/middlewares/permissionHandler";
import { auth } from "../../utils/middlewares/token";
import { assignUnAssignProcurementManagerToInspectionController, deleteInspectionController, getAllInspectionsController, getInspectionController, getInspectionListByProcurementManagerController, inspectionLoginController, registerInspectionController, updateInspectionController } from "../controllers/inspection.controller";

export const inspectionRouter = Router();

// Manager login
inspectionRouter.post("/login",
    validations(["mobileNumber", "password",]),
    inspectionLoginController);

/* Using auth middleware globally for below routes */
inspectionRouter.use(auth);

// Register inspection manager
inspectionRouter.post("/register",
    permit([Roles.adminRoleId, Roles.procurementManagerRoleId]),
    validations(["name", "email", "mobileNumber", "password",]),
    registerInspectionController);

inspectionRouter.post("/update-inspection-manager",
    permit([Roles.inspectionManagerRoleId, Roles.adminRoleId]), // Inspection manager and admin both can perform this task
    updateInspectionController);

inspectionRouter.post("/assign-unassign-proc-manager",
    permit([Roles.adminRoleId]), // Only admin can perform this task
    assignUnAssignProcurementManagerToInspectionController);

inspectionRouter.post("/delete-inspection-manager",
    permit([Roles.adminRoleId]), // Only admin can perform this task
    deleteInspectionController);

inspectionRouter.get("/get-inspection-manager-by-id",
    permit([Roles.adminRoleId, Roles.inspectionManagerRoleId]), // Admin and inspection manager can perform this task
    getInspectionController);

inspectionRouter.get("/get-inspection-manager-by-pro-man",
    permit([Roles.adminRoleId, Roles.procurementManagerRoleId]), // Admin and Procurement manager can perform this task
    getInspectionListByProcurementManagerController);

inspectionRouter.get("/get-all-inspection-managers",
    permit([Roles.adminRoleId]), // Admin can perform this task
    getAllInspectionsController);