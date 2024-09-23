import mongoose, { Schema } from "mongoose";
import { AdminInterface } from "../interfaces/admin.interface";
import { Roles } from "../../utils/common/enums/roles";
import { Status } from "../../utils/common/enums/status";

const adminSchema = new Schema<AdminInterface>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    mobile_number: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: Status.activeStatus,
    },
    role: {
        type: Number,
        required: true,
        default: Roles.adminRoleId,
    },
}, { timestamps: true });

export default mongoose.model<AdminInterface>("admins", adminSchema);