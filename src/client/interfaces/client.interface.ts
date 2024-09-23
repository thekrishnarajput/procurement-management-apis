import { ObjectId } from "mongoose";

export default interface iClient {
    clientId?: string;
    name: string;
    email: string;
    mobile_number: number;
    password: string;
    address?: string;
    role: number;
    status: number;
    orders?: ObjectId[];
    created_at: Date;
    updated_at?: Date;
};