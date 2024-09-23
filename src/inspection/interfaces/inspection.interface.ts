import { ObjectId } from "mongoose";
import { iUpdatedBy } from "../../utils/common/interfaces/types.interface";

export default interface iInspectionManager {
    _id?: ObjectId;
    name: string;
    email: string;
    mobile_number: number;
    password: string;
    address?: string;
    role: number;
    status: number;
    procurementManager?: ObjectId;
    checklistIds?: ObjectId[];
    updated_by?: iUpdatedBy[];
    adminId?: ObjectId;
    created_at: Date;
    updated_at?: Date;
};