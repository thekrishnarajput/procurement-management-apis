import { iResponse } from "../common/interfaces/types.interface";

export const response = async (res: iResponse, statusCode: number, isStatus: boolean, message: string, result: any) => {
    return res.status(statusCode).json({
        success: isStatus,
        message: message,
        data: result
    });
};