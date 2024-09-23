import { ObjectId } from "mongodb";

import { HttpStatus } from "../../utils/common/enums/httpStatusCodes";
import { response } from "../../utils/middlewares/response";
import { messages } from "../../utils/common/functions/message";
import { iNextFunction, iRequest, iResponse } from "../../utils/common/interfaces/types.interface";
import iClient from "../interfaces/client.interface";
import { printLogger } from "../../utils/common/functions/logger";
import { LoggerType } from "../../utils/common/enums/loggerTypes";
import { comparePassword, hashPassword } from "../../utils/common/functions/passwordHashing";
import clientModel from "../models/client.model";
import { Status } from "../../utils/common/enums/status";
import { Roles } from "../../utils/common/enums/roles";
import { genToken } from "../../utils/middlewares/token";
import orderModel from "../../order/models/order.model";
import iOrderDoc from "../interfaces/orderDoc.interface";

// Register client controller
export const registerClientController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body: iClient = req.body;
        const clientExists = await clientModel.getClientByEmail(Body.email);

        if (clientExists) {
            return response(res, HttpStatus.badRequest, false, messages.alreadyExists(`email: ${Body.email}`), null);
        }

        Body.password = await hashPassword((Body?.password));
        Body.status = Status.inactiveStatus;
        Body.role = Roles.clientRoleId;

        let saveResult = await clientModel.createClient(Body);
        if (!saveResult) {
            return response(res, HttpStatus.internalServerError, false, messages.clientNotSaved(), null);
        }
        return response(res, HttpStatus.ok, true, messages.clientSaved(), saveResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "registerClientController", "client.controller.ts");
        next(error);
    }
};

// Client login controller
export const clientLoginController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body = req.body;

        let clientEmail = Body?.email.trim();;
        let clientPassword: string = (Body?.password + "").trim();
        const clientResult = await clientModel.getClientByEmail(clientEmail);
        if (clientResult) {
            const { password, ...restProps } = clientResult;
            // Check if the client is blocked or deleted
            if (restProps.status === Status.deletedStatus || restProps.status === Status.blockedStatus) {
                return response(res, HttpStatus.forbidden, false, messages.blockedOrDeletedMessage(), null);
            }

            if (password) {
                let passwordMatched = await comparePassword(clientPassword, password);
                if (passwordMatched) {
                    console.log("restProps:-", restProps);
                    // Check if the client is logging in for the first time then mark the status as active
                    if (restProps.status === Status.inactiveStatus) {
                        let updateResult = await clientModel.updateClientById(restProps._id, { status: Status.activeStatus });
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
        printLogger(LoggerType.error, error.message, "clientLoginController", "client.controller.ts");
        next(error);
    }
};

// Update client controller
export const updateClientController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body: iClient = req.body;
        // Destruct the Body object so client can't modify the crucial fields
        const { clientId, role, status, email, mobile_number, ...restBodyProps } = Body;

        let client_id: ObjectId = req.user?.role === Roles.adminRoleId ? +(clientId || "") : (req.user?._id);
        if (restBodyProps?.password !== "") {
            restBodyProps.password = await hashPassword(restBodyProps.password);
        }
        const updateResult = await clientModel.updateClientById(client_id, restBodyProps);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.updatedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.updatedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "updateClientController", "client.controller.ts");
        next(error);
    }
};

// Send order doc controller
export const sendOrderDocController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        if (!req.file) {
            return response(res, HttpStatus.badRequest, false, messages.notFileUploadedError(), null);
        }

        const documentPath = req.file.path;

        let clientId: string = req.user?._id;

        const orderDoc: iOrderDoc = {
            clientId: clientId,
            documentPath: documentPath,
        };

        var clientResult = await orderModel.saveClientOrderDoc(orderDoc);

        if (!clientResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        return response(res, HttpStatus.ok, true, messages.orderInitiated(), clientResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "sendOrderDocController", "client.controller.ts");
        next(error);
    }
};

// delete client controller
export const deleteClientController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let client_id: ObjectId = req.user?.role === Roles.adminRoleId ? req.body?.clientId : req.user?._id;

        let clientResult = await clientModel.getClientById(client_id);

        if (!clientResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        // Soft delete client by updating the status as deleted
        let updateStatus = { status: Status.deletedStatus };

        const updateResult = await clientModel.updateClientById(client_id, updateStatus);

        if (!updateResult) {
            return response(res, HttpStatus.internalServerError, false, messages.deletedFailed(), null);
        }
        return response(res, HttpStatus.ok, true, messages.deletedSuccess(), updateResult);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "deleteClientController", "client.controller.ts");
        next(error);
    }
};

// Get client data
export const getClientController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let client_id: ObjectId = new ObjectId(req.params?._id);

        let clientResult = await clientModel.getClientById(client_id);

        if (!clientResult) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        const { password, ...restClientProps } = clientResult;
        return response(res, HttpStatus.ok, true, messages.dataFound(), restClientProps);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getClientController", "client.controller.ts");
        next(error);
    }
};

// Get all clients data
export const getAllClientsController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {

        let clientResult = await clientModel.getAllClients();

        if (clientResult.length === 0) {
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }

        let responseData = {
            count: clientResult.length,
            clients: clientResult
        }
        return response(res, HttpStatus.ok, true, messages.dataFound(), responseData);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "getAllClientsController", "client.controller.ts");
        next(error);
    }
};