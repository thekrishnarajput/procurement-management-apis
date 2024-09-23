import connect from "../../../config/db";
import { LoggerType } from "../enums/loggerTypes";
import { printLogger } from "./logger";

// Process all queries in this common function
export const processQueryFn = async (query: string, values?: Array<any>) => {
    try {
        // Connect to the database
        const con = await connect;

        // Execute query with values if they exist
        if (values) {
            let result = JSON.parse(JSON.stringify(await con.query(query, values)));
            return result[0];
        }
        let result = JSON.parse(JSON.stringify(await con.query(query)));
        return result[0];
    }
    catch (error: any) {
        console.error(error);
        printLogger(LoggerType.error, error.message, "processQueryFn", "db.config.ts");
        return error;
    }
}