import mongoose, { Schema, ObjectId } from "mongoose";

import iProcurementManager from "../interfaces/procurement.interface";
import { Status } from "../../utils/common/enums/status";
import { Roles } from "../../utils/common/enums/roles";

const clientSchema = new Schema<iProcurementManager>({
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
    inspectionManagers: [
        {
            type: Schema.ObjectId,
            ref: "inspection_managers",
        }
    ]
}, { timestamps: true });

export default mongoose.model<iProcurementManager>("procurement_managers", clientSchema);