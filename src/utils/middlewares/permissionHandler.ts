import { HttpStatus } from "../common/enums/httpStatusCodes";
import { messages } from "../common/functions/message";
import { iNextFunction, iRequest, iResponse } from "../common/interfaces/types.interface"
import { response } from "./response";

// Role based permission for routes to prevent unauthorized access
export const permit = (roles: Array<number>) => {
    return (req: iRequest, res: iResponse, next: iNextFunction) => {

        const roleId = req?.user.role;

        if (!roles.includes(roleId)) {
            return response(res, HttpStatus.unauthorized, false, messages.notAuthorized(), null);
        }
        next();
    };
};