import { validationResult } from "express-validator";
import { iNextFunction, iRequest, iResponse } from "../../utils/common/interfaces/types.interface";
import { response } from "../../utils/middlewares/response";
import { HttpStatus } from "../../utils/common/enums/httpStatusCodes";
import { messages } from "../../utils/common/functions/message";
import adminModel from "../models/admin.model";
import { comparePassword, hashPassword } from "../../utils/common/functions/passwordHashing";
import { genAdminToken } from "../../utils/middlewares/token";
import { printLogger } from "../../utils/common/functions/logger";
import { LoggerType } from "../../utils/common/enums/loggerTypes";
import { Roles } from "../../utils/common/enums/roles";
import { Status } from "../../utils/common/enums/status";

// Auto admin create controller
export const autoAdminCreateController = async () => {
    try {
        const { ADMIN_NAME, ADMIN_NAME2, ADMIN_EMAIL, ADMIN_EMAIL2, ADMIN_PASSWORD, ADMIN_PASSWORD2, ADMIN_MOBILE, ADMIN_MOBILE2 } = process.env;

        let adminDataArray: Array<any> = [
            {
                name: (ADMIN_NAME + ""),
                email: (ADMIN_EMAIL || ""),
                mobile_number: parseInt((ADMIN_MOBILE || ""), 10),
                password: await hashPassword((ADMIN_PASSWORD + "")),
                role: Roles.adminRoleId,
                status: Status.activeStatus,
                created_at: new Date()
            },
            {
                name: (ADMIN_NAME2 + ""),
                email: (ADMIN_EMAIL2 || ""),
                mobile_number: parseInt((ADMIN_MOBILE2 || ""), 10),
                password: await hashPassword((ADMIN_PASSWORD2 + "")),
                role: Roles.adminRoleId,
                status: Status.activeStatus,
                created_at: new Date()
            }
        ];

        adminDataArray.forEach(async (result: any) => {
            let adminResult = await adminModel.getAdmin(result.email);

            if (!adminResult) {
                let saveAdminResult = await adminModel.saveAdmin(result);
                if (saveAdminResult) {
                    console.log(`Admin ${saveAdminResult} created successfully!`);
                }
                else {
                    console.log("Admin creation failed, something went wrong: ", saveAdminResult);
                }
            }
            else {
                console.log(`Admin is already created!`);
            }
        });
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "autoCreateAdminController", "admin.controller.ts");
    }
}

// Admin login controller
export const adminLoginController = async (req: iRequest, res: iResponse, next: iNextFunction) => {
    try {
        let Body = req.body;

        let adminEmail = Body?.email.trim();;
        let adminPassword: string = (Body?.password + "").trim();
        const adminResult = await adminModel.getAdmin(adminEmail);
        if (adminResult) {
            const { password, ...restProps } = adminResult;
            if (password) {
                let passwordMatched = await comparePassword(adminPassword, password);
                if (passwordMatched) {
                    const jwt = await genAdminToken(restProps);
                    return response(res, HttpStatus.ok, true, messages.loginSuccess(), jwt);
                }
                return response(res, HttpStatus.notFound, false, messages.incorrectPassword(), null);
            }
            return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
        }
        return response(res, HttpStatus.notFound, false, messages.noDataFound(), null);
    }
    catch (error: any) {
        console.error("Catch error:-", error);
        printLogger(LoggerType.error, error.message, "adminLoginController", "admin.controller.ts");
        next(error);
    }
};