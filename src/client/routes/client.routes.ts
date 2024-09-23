import { Router } from "express";
import { validations } from "../../utils/middlewares/validationHandler";

import { Roles } from "../../utils/common/enums/roles";
import { permit } from "../../utils/middlewares/permissionHandler";
import { auth } from "../../utils/middlewares/token";
import { deleteClientController, getAllClientsController, getClientController, registerClientController, clientLoginController, sendOrderDocController, updateClientController } from "../controllers/client.controller";
import { upload } from "../../utils/middlewares/upload";

export const clientRouter = Router();

clientRouter.post("/login",
    validations(["email", "password"]),
    clientLoginController);

/* Using auth middleware globally for below routes */
clientRouter.use(auth);

// Register client data
clientRouter.post("/register",
    permit([Roles.adminRoleId, Roles.procurementManagerRoleId]),
    validations(["name", "email", "mobileNumber", "password"]),
    registerClientController);

clientRouter.post("/update-client",
    permit([Roles.clientRoleId, Roles.adminRoleId]), // Client and admin both can perform this task
    updateClientController);

clientRouter.post("/delete-client",
    permit([Roles.adminRoleId]), // Admin can perform this task
    deleteClientController);

clientRouter.post("/send-order-doc",
    permit([Roles.clientRoleId]), // Client can perform this task
    upload.single('document'),
    sendOrderDocController);

clientRouter.get("/get-client/:id",
    permit([Roles.adminRoleId]), // Admin can perform this task
    validations(["_id"]),
    getClientController);

clientRouter.get("/get-all-clients",
    permit([Roles.adminRoleId]), // Admin can perform this task
    getAllClientsController);