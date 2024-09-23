import mongoose, { Schema, ObjectId } from "mongoose";

import { iChecklist } from "../interfaces/checklist.interface";

const checklistSchema = new Schema<iChecklist>({
    driverDetails: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    goods: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    summary: {
        type: String,
        default: ""
    },
    clientId: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        beforeLoading: String,
        afterLoading: String,
    }],
    updated_by: [{
        _id: Schema.ObjectId,
        updated_at: Date
    }],
    orderIds: {
        type: Schema.ObjectId,
        ref: "orders"
    }
}, { timestamps: true });

export default mongoose.model<iChecklist>("checklists", checklistSchema);