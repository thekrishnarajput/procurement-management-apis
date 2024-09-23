import { iChecklist } from "../interfaces/checklist.interface";
import checklistSchema from "../schemas/checklist.schema";

const checklistModel = {
    createChecklist: async (checklistData: iChecklist) => {
        const checklist = new checklistSchema(checklistData);
        return await checklist.save();
    },
    getChecklistById: async (checklistId: string) => {
        let checklist = await checklistSchema.findOne({ _id: checklistId }).lean();
        return checklist;
    },
    getAllChecklists: async () => {
        let checklists = await checklistSchema.find().lean();
        return checklists;
    },
    updateChecklistById: async (checklistId: string, updateData: any) => {
        const { updatedBy, ...restProps } = updateData;

        let query = { _id: checklistId };
        let update = {
            $set: restProps,
            $push: {
                updated_by: {
                    _id: updatedBy,
                    updated_at: new Date()
                }
            },
        };
        let result = await checklistSchema.updateOne(query, update);
        return result;
    },
    deleteChecklistById: async (checklistId: string) => {
        let result = await checklistSchema.deleteOne({ _id: checklistId });
        return result;
    }
};

export default checklistModel;