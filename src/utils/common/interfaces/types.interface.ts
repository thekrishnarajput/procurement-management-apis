import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongoose";

// Interface for the auth middleware to add the user type in the request
export interface iRequest extends Request {
    user?: any;
};

export interface iResponse extends Response { };

export interface iNextFunction extends NextFunction { };

export interface iUpdatedBy {
    _id: ObjectId;
    updated_at: Date;
}

