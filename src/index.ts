import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import moment from "moment";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

dotenv.config();

// Import modules
import { connectDB } from "./config/db";
import { autoAdminCreateController } from "./admin/controllers/admin.controller";
import { urlNotFound } from "./utils/middlewares/urlNotFoundHandler";
import { adminRouter } from "./admin/routes/admin.routes";
import { clientRouter } from "./client/routes/client.routes";
import { procurementRouter } from "./procurement/routes/procurement.routes";
import { inspectionRouter } from "./inspection/routes/inspection.routes";
import { checklistRouter } from "./checklist/routes/checklist.routes";
import { limiter } from "./utils/middlewares/rateLimiter";
import { errorHandler } from "./utils/middlewares/errorHandler";

// Initialize the express app
const app = express();

const { PORT } = process.env;

if (!PORT) {
    process.exit(1);
}

/* App configuration */

// Initialize the DB
connectDB();

// express.json() parses JSON data in request bodies
app.use(express.json());

// Set static files path to Public directory
app.use(express.static(path.join(__dirname + "../", "public")));

// To accept the data from nested fields in request
app.use(express.urlencoded({ extended: true }));

// helmet() adds security-related HTTP headers
app.use(helmet());

// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());

// Rate limit to 100 per 15 minutes
app.use(limiter);

// cors() enables cross-origin requests
app.use(cors());

morgan.token('date-list', () => {
    return moment().utcOffset(330).format("YYYY-MM-DD HH:mm:ss");
});

const logFormat = "Method::method, Route::url, Status-code::status, Request-time:[:date-list] Res::res[content-length] - Response-time::response-time ms";

// Use morgan logger for logging HTTP request with customized format
app.use(morgan(logFormat));

/* Routing */

app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);
app.use("/api/procurement-manager", procurementRouter);
app.use("/api/inspection-manager", inspectionRouter);
app.use("/api/checklist", checklistRouter);

// URL not found handler middleware
app.use(urlNotFound);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    autoAdminCreateController();
    console.log(`Server is running on port ${PORT}`);
});