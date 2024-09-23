import inspectionModelSchema from "../schemas/inspection.schema";
import { ObjectId } from "bson";

const inspectionModel = {
    createInspection: async (inspectionData: any) => {
        const inspection = new inspectionModelSchema(inspectionData);
        return await inspection.save();
    },
    getInspectionByMobileNumber: async (mobileNumber: number) => {
        let result = await inspectionModelSchema.findOne({ mobile_number: mobileNumber }).lean();
        return result;
    },
    getInspectionById: async (id: string) => {
        let inspectionResult = await inspectionModelSchema.findOne({ _id: id }).lean();
        return inspectionResult;
    },
    getAllInspections: async () => {
        let inspectionsResult = await inspectionModelSchema.find().lean();
        return inspectionsResult;
    },
    getAllInspectionManagersByProMan: async (procurementId: string) => {
        let inspectionsResult = await inspectionModelSchema.find({ procurementManager: procurementId }).lean();
        return inspectionsResult;
    },
    updateInspectionById: async (id: string, inspectionData: any) => {
        let result = await inspectionModelSchema.updateOne({ _id: id }, {
            $set: inspectionData
        });
        return result;
    },
    assignUnassignChecklistToInspectionById: async (id: string, updateData: any) => {
        // Convert string to Mongoose ObjectId
        let checklistId = new ObjectId(updateData.checklistIds + "");
        console.log("checklistId:-", checklistId);

        let result = await inspectionModelSchema.updateOne({ _id: id }, {
            $push: {
                checklistIds: checklistId,
                updated_by: {
                    _id: updateData.updatedBy,
                    updated_at: new Date()
                }
            },
        });
        return result;
    },
}

export default inspectionModel;