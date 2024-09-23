import { validationResult } from "express-validator";

import { HttpStatus } from "../../utils/common/enums/httpStatusCodes";
import { LoggerType } from "../../utils/common/enums/loggerTypes";
import { printLogger } from "../../utils/common/functions/logger";
import { messages } from "../../utils/common/functions/message";
import { iNextFunction, iRequest, iResponse } from "../../utils/common/interfaces/types.interface";
import { response } from "../../utils/middlewares/response";
import checklistModel from "../models/checklist.model";
import { iChecklist } from "../interfaces/checklist.interface";
import inspectionModel from "../../inspection/models/inspection.model";

// Create checklist controller
export const createChecklistController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body: iChecklist = req.body;

        // Create new Checklist for Client and then add item into it
        let newClientChecklist: any = await checklistModel.createChecklist(Body);

        if (!newClientChecklist) {
            return response(res, HttpStatus.internalServerError, false, messages.errorMessage(), null);
        }
        return response(res, HttpStatus.ok, true, messages.checklistAdded(), newClientChecklist);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "updateChecklistController", "checklist.controller.ts");
        next(error);
    }
};

// Update checklist controller
export const updateChecklistController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        if (!req.files || req.files.length === 0) {
            return response(res, HttpStatus.badRequest, false, messages.notFileUploadedError(), null);
        }
        // Access file paths
        const filePaths: string[] = (req.files as Express.Multer.File[]).map(file => file.path);

        const { checklist_id, ...formData } = req.body;

        // Initialize an object to store structured data
        const structuredData: any = {};

        // Function to recursively set value in structuredData
        const setValue = (obj: any, keys: string[], value: any) => {
            const currentKey = keys[0];
            const remainingKeys = keys.slice(1);

            if (remainingKeys.length === 0) {
                // Assign value when no more keys left
                if (Array.isArray(obj[currentKey])) {
                    obj[currentKey].push(value); // Push to array if key is already an array
                } else if (obj[currentKey]) {
                    obj[currentKey] = [obj[currentKey], value]; // Convert to array if key already exists
                } else {
                    obj[currentKey] = value; // Directly assign value if key doesn't exist
                }
            } else {
                // Initialize object if not existing
                obj[currentKey] = obj[currentKey] || {};

                // Recursively set value
                setValue(obj[currentKey], remainingKeys, value);
            }
        };

        // Iterate over formData keys
        Object.keys(formData).forEach(key => {
            // Split the key into parts based on '.'
            const keys = key.split('.');

            // Skip 'summary' key as it's handled separately
            if (key !== 'summary') {
                setValue(structuredData, keys, formData[key]);
            }
        });

        // Handle 'summary' key separately
        if (formData.summary) {
            structuredData.summary = formData.summary;
        }

        let images = [{
            beforeLoading: filePaths[0],
            afterLoading: filePaths[1],
        }];
        structuredData.images = images;
        structuredData.updatedBy = req.user?._id || null;

        const updateResult = await checklistModel.updateChecklistById(checklist_id, structuredData);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "updateChecklistController", "checklist.controller.ts");
        next(error);
    }
};

// Get all checklist items
export const getAllChecklistItemsController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let responseData = await getAllChecklists();
        return response(res, HttpStatus.ok, true, messages.dataFound(), responseData);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getAllChecklistItemsController", "checklist.controller.ts");
        next(error);
    }
};

// Get checklist by ID
export const getChecklistByIdController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let checklist_id: string = (req.query?.checklist_id + "");

        let checklistItemsResult = await checklistModel.getChecklistById(checklist_id);

        if (!checklistItemsResult) {
            return response(res, HttpStatus.internalServerError, false, messages.noDataFound(), null);
        }
        return response(res, HttpStatus.ok, true, messages.dataFound(), checklistItemsResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getAllChecklistItemsController", "checklist.controller.ts");
        next(error);
    }
};

// delete checklist controller
export const deleteChecklistController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let checklist_id: string = req.body?.checklistId;

        let checklistResult = await checklistModel.getChecklistById(checklist_id);

        if (!checklistResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        const deleteResult = await checklistModel.deleteChecklistById(checklist_id);

        if (!deleteResult) {
            return response(res, HttpStatus.internalServerError, false, messages.deletedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.deletedSuccess(), deleteResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "deleteChecklistController", "checklist.controller.ts");
        next(error);
    }
};

// Assign/Unassign checklist controller
export const assignUnassignChecklistController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body = req.body;
        let updateData = {
            updatedBy: req.user?._id,
            checklistIds: Body.checklist_id
        }
        const updateResult = await inspectionModel.assignUnassignChecklistToInspectionById(Body.inspectionId, updateData);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "deleteChecklistController", "checklist.controller.ts");
        next(error);
    }
};

const getAllChecklists = async () => {
    let checklistItemsResult = await checklistModel.getAllChecklists();
    if (checklistItemsResult.length === 0) {
        return { total_checklists: 0 }
    }
    let totalChecklists = checklistItemsResult.length;

    return { total_checklists: totalChecklists, checklists: checklistItemsResult }
};