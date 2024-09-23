import { ObjectId } from "mongodb";
import clientSchema from "../schemas/client.schema";

const clientModelSchema = clientSchema;

const clientModel = {
    createClient: async (clientData: any) => {
        const client = new clientModelSchema(clientData);
        return await client.save();
    },
    getClientByEmail: async (email: string) => {
        let result = await clientModelSchema.findOne({ email: email }).lean();
        return result;
    },
    getClientByMobile: async (mobileNumber: number) => {

    },
    getClientById: async (id: ObjectId) => {
        let clientResult = await clientModelSchema.findOne({ _id: id }).lean();
        return clientResult;
    },
    getAllClients: async () => {
        let clientsResult = await clientModelSchema.find().lean();
        return clientsResult;
    },
    updateClientById: async (id: ObjectId, clientData: any) => {
        let result = await clientModelSchema.updateOne({ _id: id }, {
            $set: clientData
        })
        return result;
    },
}

export default clientModel;