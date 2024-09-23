import { Document } from "mongoose";

/* Define interface */
export interface AdminInterface extends Document {
    name: string;
    email: string;
    mobile_number: number;
    password: string;
    role: number;
    status: number;
    created_at: Date;
    updated_at?: Date;
}