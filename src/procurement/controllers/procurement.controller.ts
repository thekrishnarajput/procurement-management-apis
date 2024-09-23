import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";

import { HttpStatus } from "../../utils/common/enums/httpStatusCodes";
import { response } from "../../utils/middlewares/response";
import { messages } from "../../utils/common/functions/message";
import { iNextFunction, iRequest, iResponse } from "../../utils/common/interfaces/types.interface";
import iProcurement from "../interfaces/procurement.interface";
import { printLogger } from "../../utils/common/functions/logger";
import { LoggerType } from "../../utils/common/enums/loggerTypes";
import { comparePassword, hashPassword } from "../../utils/common/functions/passwordHashing";
import procurementModel from "../models/procurement.model";
import { Status } from "../../utils/common/enums/status";
import { Roles } from "../../utils/common/enums/roles";
import { genToken } from "../../utils/middlewares/token";
import orderModel from "../../order/models/order.model";
import iOrderDoc from "../interfaces/orderDoc.interface";

// Register procurement controller
export const registerProcurementController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body: iProcurement = req.body;
        const procurementExists = await procurementModel.getProcurementByEmail(Body.email);

        if (procurementExists) {
            return response(res, HttpStatus.badRequest, false, messages.alreadyExists(`email: ${Body.email}`), null);
        }

        Body.password = await hashPassword((Body?.password));
        Body.status = Status.inactiveStatus;
        Body.role = Roles.procurementManagerRoleId;

        let saveResult = await procurementModel.createProcurement(Body);
        if (!saveResult) {
            return response(res, HttpStatus.internalServerError, false, messages.procurementNotSaved(), null);
        }
        return response(res, HttpStatus.ok, true, messages.procurementSaved(), saveResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "registerProcurementController", "procurement.controller.ts");
        next(error);
    }
};

// Procurement login controller
export const procurementLoginController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body = req.body;

        let procurementEmail = Body?.email.trim();;
        let procurementPassword: string = (Body?.password + "").trim();
        const procurementResult = await procurementModel.getProcurementByEmail(procurementEmail);
        if (procurementResult) {
            const { password, ...restProps } = procurementResult;
            // Check if the procurement is blocked or deleted
            if (restProps.status === Status.deletedStatus || restProps.status === Status.blockedStatus) {
                return response(res, HttpStatus.forbidden, false, messages.blockedOrDeletedMessage(), null);
            }

            if (password) {
                let passwordMatched = await comparePassword(procurementPassword, password);
                if (passwordMatched) {
                    console.log("restProps:-", restProps);
                    // Check if the procurement manager is logging in for the first time then mark the status as active
                    if (restProps.status === Status.inactiveStatus) {
                        let updateResult = await procurementModel.updateProcurementById((restProps._id + ""), { status: Status.activeStatus });
                        if (updateResult) {
                            restProps.status = Status.activeStatus;
                        }
                    }
                    const jwt = await genToken(restProps);
                    let responseData = {
                        token: jwt,
                        ...restProps,
                    };
                    return response(res, HttpStatus.ok, true, messages.loginSuccess(), responseData);
                }
                return response(res, HttpStatus.unauthorized, false, messages.incorrectPassword(), null);
            }
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }
        return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "procurementLoginController", "procurement.controller.ts");
        next(error);
    }
};

// Update procurement controller
export const updateProcurementController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body: iProcurement = req.body;
        // Destruct the Body object so procurement can't modify the crucial fields
        const { _id: procurementId, role, status, email, mobile_number, ...restBodyProps } = Body;

        let procurement_id: string = req.user?.role === Roles.adminRoleId ? (procurementId || "") : req.user?._id;

        restBodyProps.password = await hashPassword(restBodyProps.password);

        const updateResult = await procurementModel.updateProcurementById(procurement_id, restBodyProps);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "updateProcurementController", "procurement.controller.ts");
        next(error);
    }
};

// delete procurement controller
export const deleteProcurementController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let procurement_id: string = req.user?.role === Roles.adminRoleId ? req.body?.procurementId : req.user?._id;

        let procurementResult = await procurementModel.getProcurementById(procurement_id);

        if (!procurementResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        // Soft delete procurement by updating the status as deleted
        let updateStatus = { status: Status.deletedStatus };

        const updateResult = await procurementModel.updateProcurementById(procurement_id, updateStatus);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.deletedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.deletedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "deleteProcurementController", "procurement.controller.ts");
        next(error);
    }
};

// Get procurement data
export const getProcurementController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let procurement_id: string = (req.query?._id + "");

        let procurementResult = await procurementModel.getProcurementById(procurement_id);

        if (!procurementResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        const { password, ...restProcurementProps } = procurementResult;
        return response(res, HttpStatus.ok, true, messages.dataFound(), restProcurementProps);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getProcurementController", "procurement.controller.ts");
        next(error);
    }
};

// Get all procurements data
export const getAllProcurementsController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {

        let procurementResult = await procurementModel.getAllProcurements();

        if (procurementResult.length === 0) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        let responseData = {
            count: procurementResult.length,
            procurement_managers: procurementResult
        }
        return response(res, HttpStatus.ok, true, messages.dataFound(), responseData);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getAllProcurementsController", "procurement.controller.ts");
        next(error);
    }
};