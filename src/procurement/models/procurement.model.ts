// import { ObjectId } from "mongodb";
import procurementModelSchema from "../schemas/procurement.schema";

const procurementModel = {
    createProcurement: async (procurementData: any) => {
        const procurement = new procurementModelSchema(procurementData);
        return await procurement.save();
    },
    getProcurementByEmail: async (email: string) => {
        let result = await procurementModelSchema.findOne({ email: email }).lean();
        return result;
    },
    getProcurementById: async (id: string) => {
        let procurementResult = await procurementModelSchema.findOne({ _id: id }).lean();
        return procurementResult;
    },
    getAllProcurements: async () => {
        let procurementsResult = await procurementModelSchema.find().lean();
        return procurementsResult;
    },
    updateProcurementById: async (id: string, procurementData: any) => {
        let result = await procurementModelSchema.updateOne({ _id: id }, {
            $set: procurementData
        });
        return result;
    },
    assignUnAssignInspectionFromProcurement: async (id: string, procurementData: any) => {
        let result = await procurementModelSchema.updateOne({ _id: id }, {
            $set: procurementData,
        });
        return result;
    },
}

export default procurementModel;