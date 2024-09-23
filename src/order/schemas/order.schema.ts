import mongoose, { Schema } from "mongoose";

import { iOrder } from "../interfaces/order.interface";
import { OrderStatus } from "../../utils/common/enums/orderStatus";
const { ObjectId } = Schema;

const orderSchema = new Schema<iOrder>({
    clientId: {
        type: ObjectId,
        ref: "Client",
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: OrderStatus.orderPending,
    },
    documentPath: {
        type: String,
        required: true,
    },
    updated_by: [
        {
            id: ObjectId,
            updated_at: Date
        }
    ]
}, { timestamps: true });

export default mongoose.model<iOrder>("orders", orderSchema);