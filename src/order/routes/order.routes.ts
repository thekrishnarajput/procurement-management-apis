import { Router } from "express";
import { validator } from "../../utils/middlewares/validationHandler";
import { getAllOrdersController, getClientAllOrdersController, getOrdersDetailsByIdController, updateOrderDetailsController, updateOrderStatusController } from "../controllers/order.controller";
import { Roles } from "../../utils/common/enums/roles";
import { permit } from "../../utils/middlewares/permissionHandler";
import { auth } from "../../utils/middlewares/token";

export const orderRouter = Router();

// Get all order list
orderRouter.get("/all-orders",
    auth,
    permit([Roles.adminRoleId, Roles.procurementManagerRoleId]),  // Only Admin can access this
    getAllOrdersController);

// Get all order list by a specific client
orderRouter.get("/client-all-orders",
    auth,
    permit([
        Roles.clientRoleId,
        Roles.adminRoleId,
        Roles.inspectionManagerRoleId,
        Roles.procurementManagerRoleId
    ]),  // Only Admin, Client, Inspection Manager and Procurement Manager can access this
    validator.checklist_id,
    getClientAllOrdersController);

// Get order details by specific order id
orderRouter.get("/order-details-by-id",
    auth,
    permit([Roles.clientRoleId, Roles.adminRoleId]),  // Client and Admin both can access this
    validator.order_id,
    getOrdersDetailsByIdController);

// Update order details
orderRouter.post("/update-order-status",
    auth,
    permit([
        Roles.adminRoleId,
        Roles.inspectionManagerRoleId,
        Roles.procurementManagerRoleId
    ]),  // Only Admin, Inspection Manager and Procurement Manager can access this
    validator.order_id,
    updateOrderStatusController);

// Update order details (link checklist to any particular order)
orderRouter.post("/update-order-details",
    auth,
    permit([Roles.procurementManagerRoleId]),  // Only Admin, Inspection Manager and Procurement Manager can access this
    validator.order_id,
    validator.checklist_id,
    updateOrderDetailsController);