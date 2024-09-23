import { ObjectId } from "mongoose";

export default interface iProcurementManager {
    _id?: ObjectId;
    name: string;
    email: string;
    mobile_number: number;
    password: string;
    address?: string;
    role: number;
    status: number;
    inspectionManagers?: ObjectId[];
    created_at: Date;
    updated_at?: Date;
};