import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";

import { HttpStatus } from "../../utils/common/enums/httpStatusCodes";
import { response } from "../../utils/middlewares/response";
import { messages } from "../../utils/common/functions/message";
import { iNextFunction, iRequest, iResponse } from "../../utils/common/interfaces/types.interface";
import iInspection from "../interfaces/inspection.interface";
import { printLogger } from "../../utils/common/functions/logger";
import { LoggerType } from "../../utils/common/enums/loggerTypes";
import { comparePassword, hashPassword } from "../../utils/common/functions/passwordHashing";
import inspectionModel from "../models/inspection.model";
import { AssignUnassignStatus, Status } from "../../utils/common/enums/status";
import { Roles } from "../../utils/common/enums/roles";
import { genToken } from "../../utils/middlewares/token";
import orderModel from "../../order/models/order.model";
import procurementModel from "../../procurement/models/procurement.model";

// Register inspection controller
export const registerInspectionController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body: iInspection = req.body;
        const inspectionExists = await inspectionModel.getInspectionByMobileNumber(Body.mobile_number);

        if (inspectionExists) {
            return response(res, HttpStatus.badRequest, false, messages.alreadyExists(`email: ${Body.email}`), null);
        }

        Body.password = await hashPassword((Body?.password));
        Body.status = Status.inactiveStatus;
        Body.role = Roles.inspectionManagerRoleId;

        if (req.user?.role === Roles.adminRoleId) {
            Body.adminId = req.user?._id;
        }
        else {
            Body.procurementManager = req.user?._id;
        }

        let saveResult = await inspectionModel.createInspection(Body);
        if (!saveResult) {
            return response(res, HttpStatus.internalServerError, false, messages.inspectionNotSaved(), null);
        }
        return response(res, HttpStatus.ok, true, messages.inspectionSaved(), saveResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "registerInspectionController", "inspection.controller.ts");
        next(error);
    }
};

// Inspection login controller
export const inspectionLoginController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body = req.body;

        let inspectionMobileNumber = Body?.mobile_number;
        let inspectionPassword: string = (Body?.password + "").trim();
        const inspectionResult = await inspectionModel.getInspectionByMobileNumber(inspectionMobileNumber);
        if (inspectionResult) {
            const { password, ...restProps } = inspectionResult;
            // Check if the inspection is blocked or deleted
            if (restProps.status === Status.deletedStatus || restProps.status === Status.blockedStatus) {
                return response(res, HttpStatus.forbidden, false, messages.blockedOrDeletedMessage(), null);
            }

            if (password) {
                let passwordMatched = await comparePassword(inspectionPassword, password);
                if (passwordMatched) {
                    console.log("restProps:-", restProps);
                    // Check if the inspection manager is logging in for the first time then mark the status as active
                    if (restProps.status === Status.inactiveStatus) {
                        let updateResult = await inspectionModel.updateInspectionById((restProps._id + ""), { status: Status.activeStatus });
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
        printLogger(LoggerType.error, error.message, "inspectionLoginController", "inspection.controller.ts");
        next(error);
    }
};

// Update inspection controller
export const updateInspectionController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }
        let Body: iInspection = req.body;
        // Destruct the Body object so inspection can't modify the crucial fields
        const { _id: inspectionId, role, status, email, mobile_number, ...restBodyProps } = Body;

        let inspection_id: string = req.user?.role === Roles.adminRoleId ? (inspectionId || "") : req.user?._id;

        restBodyProps.password = await hashPassword(restBodyProps.password);

        const updateResult = await inspectionModel.updateInspectionById(inspection_id, restBodyProps);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "updateInspectionController", "inspection.controller.ts");
        next(error);
    }
};

// delete inspection controller
export const deleteInspectionController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }
        let inspection_id: string = req.user?.role === Roles.adminRoleId ? req.body?.inspectionId : req.user?._id;

        let inspectionResult = await inspectionModel.getInspectionById(inspection_id);

        if (!inspectionResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        // Soft delete inspection by updating the status as deleted
        let updateStatus = { status: Status.deletedStatus };

        const updateResult = await inspectionModel.updateInspectionById(inspection_id, updateStatus);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.deletedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.deletedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "deleteInspectionController", "inspection.controller.ts");
        next(error);
    }
};


// Update inspection controller
export const assignUnAssignProcurementManagerToInspectionController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }
        let Body: { inspectionId: string, procurementId: string, isAssigning: number } = req.body;


        const getInspectionManagerResult = await inspectionModel.getInspectionById(Body.inspectionId);

        let updateData = { procurementManager: "", adminId: "" };
        // Check if procurement manger's id is exists then it means unassign it and assign admin id by default
        if (Body.isAssigning === AssignUnassignStatus.unassignedStatus) {
            updateData.procurementManager = "";
            updateData.adminId = req.user?._id;
        }
        // Else assign procurement manger's id and unassign admin id by
        else if (Body.isAssigning === AssignUnassignStatus.assignedStatus) {
            updateData.procurementManager = Body.procurementId;
            updateData.adminId = "";
        }
        // Else assign procurement manger's id and unassign admin id by
        else if (Body.isAssigning === AssignUnassignStatus.changingProcurementManager) {
            updateData.procurementManager = Body.procurementId;
            updateData.adminId = "";
        }

        const updateResult = await inspectionModel.updateInspectionById(Body.inspectionId, updateData);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }

        let procurementManagerId = (getInspectionManagerResult?.procurementManager + "");

        let getProcManagerResult = await procurementModel.getProcurementById(procurementManagerId);

        let inspectionIdsArray: any = [];
        if (getProcManagerResult?.inspectionManagers && getProcManagerResult?.inspectionManagers?.length > 0) {
            let getInspectionManagers = getProcManagerResult?.inspectionManagers;
            getInspectionManagers.map((ids: any) => {
                if (Body.isAssigning === AssignUnassignStatus.unassignedStatus && ids !== procurementManagerId) {
                    inspectionIdsArray.push(ids);
                }
                else if (Body.isAssigning === AssignUnassignStatus.assignedStatus) {
                    inspectionIdsArray.push(ids);
                }
                else if (Body.isAssigning === AssignUnassignStatus.changingProcurementManager && ids === procurementManagerId) {
                    inspectionIdsArray.push(Body.procurementId);
                }
            });
        }
        procurementModel.updateProcurementById((getProcManagerResult?._id + ""), { inspectionManagers: inspectionIdsArray }); // update procurement manager's inspection manager array
        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "assignUnAssignProcurementManagerToInspectionController", "inspection.controller.ts");
        next(error);
    }
};

// Get inspection Manager data
export const getInspectionController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }
        let inspection_id: string = req.user?.role === Roles.adminRoleId ? (req.query?._id + "") : req.user?._id;

        let inspectionResult = await inspectionModel.getInspectionById(inspection_id);

        if (!inspectionResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        const { password, ...restInspectionProps } = inspectionResult;
        return response(res, HttpStatus.ok, true, messages.dataFound(), restInspectionProps);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getInspectionController", "inspection.controller.ts");
        next(error);
    }
};

// Get inspection by procurement manager
export const getInspectionListByProcurementManagerController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
        }
        let inspection_id: string = (req.query?._id + "");

        let inspectionResult = await inspectionModel.getAllInspectionManagersByProMan(inspection_id);

        if (inspectionResult.length === 0) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        const { password, ...restInspectionProps } = inspectionResult[0];
        return response(res, HttpStatus.ok, true, messages.dataFound(), restInspectionProps);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getInspectionListByProcurementManagerController", "inspection.controller.ts");
        next(error);
    }
};

// Get all inspections data
export const getAllInspectionsController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {

        let inspectionResult = await inspectionModel.getAllInspections();

        if (inspectionResult.length === 0) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        let responseData = {
            count: inspectionResult.length,
            inspection_managers: inspectionResult
        }
        return response(res, HttpStatus.ok, true, messages.dataFound(), responseData);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getAllInspectionsController", "inspection.controller.ts");
        next(error);
    }
};