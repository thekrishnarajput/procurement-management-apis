import mongoose, { Schema, ObjectId } from "mongoose";

import iInspectionManager from "../interfaces/inspection.interface";
import { Status } from "../../utils/common/enums/status";
import { Roles } from "../../utils/common/enums/roles";

const clientSchema = new Schema<iInspectionManager>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile_number: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Number,
        default: Status.inactiveStatus,
        required: true
    },
    role: {
        type: Number,
        default: Roles.clientRoleId,
        required: true
    },
    address: String,
    procurementManager:
    {
        type: Schema.ObjectId,
        ref: "procurement_managers",
    },
    checklistIds: [
        {
            type: Schema.ObjectId,
            ref: "checklists",
        }],
    updated_by: [{
        updated: Schema.ObjectId,
        updated_at: Date
    }],
    adminId:
    {
        type: Schema.ObjectId,
        ref: "admins",
    },
}, { timestamps: true });

export default mongoose.model<iInspectionManager>("inspection_managers", clientSchema);