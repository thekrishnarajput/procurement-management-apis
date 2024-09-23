import { ObjectId } from "mongoose";
import { iUpdatedBy } from "../../utils/common/interfaces/types.interface";

export interface iOrder {
    _id?: ObjectId;
    clientId: ObjectId;
    documentPath: string;
    status: number;
    updated_by: iUpdatedBy[];
    created_at: Date;
    updated_at: Date;
};

export interface iOrderItem {
    id?: number;
    orderId: number;
    itemId: number;
    quantity: number;
};