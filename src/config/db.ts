import mongoose from "mongoose";
const { DB_URL } = process.env;

// Connect to DB function
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect((DB_URL + ""));
        let dbName: string = conn?.connection?.name;
        console.log(`MongoDB Connected to ${dbName}`);
    }
    catch (error: any) {
        console.log("DB connection error: " + error);
        process.exit(1);
    }
};

export const db = mongoose.connection;