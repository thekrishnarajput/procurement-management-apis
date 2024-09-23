import { ObjectId } from "mongoose";

export interface iChecklist {
    driverDetails: any;
    goods: any;
    summary: string;
    clientId: ObjectId;
    orderIds: ObjectId;
    images: iItemImages[];
    updated_by: iUpdatedBy[];
};

interface iItemImages {
    beforeLoading: string;
    afterLoading: string;
}

interface iUpdatedBy {
    _id: ObjectId;
    updated_at: Date;
}