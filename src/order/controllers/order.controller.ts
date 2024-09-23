import { validationResult } from "express-validator";

import { HttpStatus } from "../../utils/common/enums/httpStatusCodes";
import { LoggerType } from "../../utils/common/enums/loggerTypes";
import { printLogger } from "../../utils/common/functions/logger";
import { messages } from "../../utils/common/functions/message";
import { iNextFunction, iRequest, iResponse } from "../../utils/common/interfaces/types.interface";
import { response } from "../../utils/middlewares/response";
import orderModel from "../models/order.model";

// Get all orders
export const getAllOrdersController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let ordersResult = await orderModel.getAllOrders();
        if (ordersResult.length === 0) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }
        const responseData = {
            total: ordersResult.length,
            orders: ordersResult
        }
        return response(res, HttpStatus.ok, true, messages.dataFound(), responseData);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getClientAllOrdersController", "order.controller.ts");
        next(error);
    }
};

// Get client all order items
export const getClientAllOrdersController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        const clientId: number = +(req.user?.id);
        let ordersResult = await orderModel.getOrdersByClient(clientId);
        if (ordersResult.length === 0) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }
        return response(res, HttpStatus.ok, true, messages.dataFound(), ordersResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getClientAllOrdersController", "order.controller.ts");
        next(error);
    }
};

// Get order items detail by order id
export const getOrdersDetailsByIdController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }

        const orderId: string = req.params?.order_id;

        // Fetching the order details of specific order
        let ordersResult = await orderModel.getOrderById(orderId);

        if (!ordersResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        return response(res, HttpStatus.ok, true, messages.dataFound(), ordersResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getOrdersDetailsByIdController", "order.controller.ts");
        next(error);
    }
};

// Update order status
export const updateOrderStatusController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }

        const orderId: string = req.body.order_id;

        let Body: any = req.body;

        if (!orderId) {
            return response(res, HttpStatus.notAcceptable, false, messages.errorMessage(), null);
        }

        Body.updated_by = req.user?._id;
        let updateResult = await orderModel.updateOrderStatus(orderId, Body);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }

        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "updateQuantityController", "order.controller.ts");
        next(error);
    }
};

// Update order details
export const updateOrderDetailsController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }

        const orderId: string = req.body.order_id;

        let Body: any = req.body;

        if (!orderId) {
            return response(res, HttpStatus.notAcceptable, false, messages.errorMessage(), null);
        }
        Body.updated_by = req.user?._id;
        let updateResult = await orderModel.updateOrder(orderId, Body);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }

        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "updateQuantityController", "order.controller.ts");
        next(error);
    }
};