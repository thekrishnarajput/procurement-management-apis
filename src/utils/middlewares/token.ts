import jwt from "jsonwebtoken";

import { iRequest, iNextFunction, iResponse } from "../common/interfaces/types.interface";
import { HttpStatus } from "../common/enums/httpStatusCodes";
import { response } from "./response";
import { messages } from "../common/functions/message";
import { ErrData } from "./throwError";

const secretKey = (process.env.JWT_SECRET + "");

// Verify JWT token using this middleware
export const auth = async (req: iRequest, res: iResponse, next: iNextFunction) => {

    const token: string | undefined = req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return response(res, HttpStatus.unauthorized, false, messages.noTokenProvided(), null);
    }
    try {
        let decoded: any = jwt.verify(token, secretKey);
        if (decoded) {
            // We will delete iat, exp and __v fields from the token
            delete decoded.iat && decoded.exp && decoded.__v;
            req.user = decoded;
            next();
        }
    }
    catch (error: any) {
        console.error("Catch Error:-", error);
        return response(res, HttpStatus.forbidden, false, error.message, error);
        // ErrData(HttpStatus.forbidden, messages.invalidOrExpiredToken(), error);
    }
};

// Generate JWT token for the clients
export const genToken = async (params: any) => {
    const token: string = jwt.sign(params, secretKey, { expiresIn: "30d" });
    return token;
};

// Generate JWT token for the admin
export const genAdminToken = async (params: any) => {
    const token: string = jwt.sign(params, secretKey, { expiresIn: "24h" });
    return token;
}