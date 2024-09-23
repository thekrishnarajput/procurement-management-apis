import { Request, Response, NextFunction } from 'express';
import { body, check, validationResult } from 'express-validator';
import { response } from './response';
import { HttpStatus } from '../common/enums/httpStatusCodes';
import { messages } from '../common/functions/message';

export const validator = {
    _id: check('_id').notEmpty().withMessage("_id is required!").isString().withMessage('ID must be a string!'),
    email: body('email').notEmpty().withMessage('Email address is required!').isEmail().withMessage('Email address is invalid!'),
    mobileNumber: body('mobile_number').notEmpty().withMessage('Mobile number is required!').isMobilePhone('any', { strictMode: false }).withMessage('Mobile number is invalid!'),
    password: body('password').notEmpty().withMessage('Password is required!').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long!'),
    adminPassword: body('password').notEmpty().withMessage('Password is required!').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long!'),
    name: body('name').notEmpty().withMessage('Name is required!').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long!'),
    role: body('role').notEmpty().withMessage('Role is required!').isIn([1, 2]),

    checklistItemQuantity: body('items.*.quantity').notEmpty().withMessage('Quantity is required!').isInt({ min: 1 }).withMessage('Quantity must be a non-negative integer'),
    checklist_id: check('checklist_id').notEmpty().withMessage("Checklist id is required!").isString().withMessage('Checklist id must be a string!'),

    order_id: check('order_id').notEmpty().withMessage("Order id is required!").isString().withMessage('Order id must be a string!'),
    client_id: check('clientId').notEmpty().withMessage("Client id is required!").isString().withMessage('Client id must be a string!'),
    inspectionId: check('inspectionId').notEmpty().withMessage("Inspection Id is required!").isString().withMessage('Inspection Id must be a string!'),
}

const validationError = (req: Request, res: Response, next: NextFunction) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(res, HttpStatus.forbidden, false, messages.validationError(), errors.array());
    }
    next();
}

export const validations = (fields: (keyof typeof validator)[]) => {
    const allValidations = fields.map(field => validator[field]);
    return [...allValidations, validationError];
}