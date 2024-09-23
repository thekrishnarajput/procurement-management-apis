import { AdminInterface } from "../interfaces/admin.interface";
import Admin from "../schemas/admin.schema";
const adminModelSchema = Admin;
/* Service Methods */

export default {
    // Save admin
    saveAdmin: async (adminData: AdminInterface): Promise<AdminInterface> => {
        const admin = new adminModelSchema(adminData);
        return await admin.save();
    },
    // Get admin
    getAdmin: async (email: string): Promise<AdminInterface | null> => {
        let adminResult = await adminModelSchema.findOne({ email: email }).lean();
        return adminResult;
    },
};