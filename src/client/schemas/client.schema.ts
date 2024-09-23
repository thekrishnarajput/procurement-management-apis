import mongoose, { Schema, ObjectId } from "mongoose";

import iClient from "../interfaces/client.interface";
import { Status } from "../../utils/common/enums/status";
import { Roles } from "../../utils/common/enums/roles";

const clientSchema = new Schema<iClient>({
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
    orders: [
        {
            type: Schema.ObjectId,
            ref: "orders",
        }
    ]
}, { timestamps: true });

export default mongoose.model<iClient>("clients", clientSchema);