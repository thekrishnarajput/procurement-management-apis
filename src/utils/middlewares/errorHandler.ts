import { HttpStatus } from "../common/enums/httpStatusCodes";
import { iResponse } from "../common/interfaces/types.interface";
import { response } from "./response";

export const errorHandler = async (error: any, res: iResponse) => {
    const statusCode = error.statusCode || HttpStatus.internalServerError;
    const message = error.message || "Something went wrong!";
    const data = error.data || null;

    response(res, statusCode, false, message, data);
};