import { Router } from "express";
import { validations, validator } from "../../utils/middlewares/validationHandler";
import { assignUnassignChecklistController, createChecklistController, getAllChecklistItemsController, getChecklistByIdController, updateChecklistController } from "../controllers/checklist.controller";
import { Roles } from "../../utils/common/enums/roles";
import { permit } from "../../utils/middlewares/permissionHandler";
import { auth } from "../../utils/middlewares/token";
import { uploadMultiple } from "../../utils/middlewares/upload";

export const checklistRouter = Router();

/* Using auth middleware globally for below routes */
checklistRouter.use(auth);

// Create checklist
checklistRouter.post("/create-checklist",
    permit([Roles.procurementManagerRoleId]),  // Only client can add to the checklist
    validations(["order_id", "client_id"]),
    createChecklistController);

// Update the checklist
checklistRouter.post("/update-checklist",
    permit([Roles.adminRoleId, Roles.inspectionManagerRoleId]),  // Inspection Manager and admin both can add to the checklist
    uploadMultiple.any(),
    validations(["checklist_id"]),
    updateChecklistController);

// Assign/Unassign the checklist to inspection manager
checklistRouter.post("/assign-unassign-checklist",
    permit([Roles.adminRoleId, Roles.procurementManagerRoleId]),  // Procurement Manager and admin both can add to the checklist
    validations(["checklist_id", "inspectionId"]),
    assignUnassignChecklistController);

// delete the checklist
checklistRouter.get("/delete-checklist",
    permit([Roles.adminRoleId, Roles.procurementManagerRoleId]),  // Procurement Manager and admin both can add to the checklist
    validations(["checklist_id"]),
    updateChecklistController);

// Get checklist
checklistRouter.get("/get-checklist",
    permit([Roles.procurementManagerRoleId, Roles.adminRoleId, Roles.clientRoleId, Roles.inspectionManagerRoleId]),  // All roles can get access checklist
    validations(["checklist_id"]),
    getChecklistByIdController);

// Get all checklist
checklistRouter.get("/all-checklists",
    permit([Roles.procurementManagerRoleId, Roles.adminRoleId]),  // Procurement Manager and admin both can get access checklist
    getAllChecklistItemsController);