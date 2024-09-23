import pino, { LevelWithSilent, Logger } from "pino";
import path from "path";
import fs from "fs";

// Directory where log files will be stored
const logDir = path.join(__dirname, '../../../../logs');

// Function to create the log directory and controller-specific subdirectories if they don't exist
const ensureLogDirectory = (controllerName: string) => {
    const controllerLogDirectory = path.join(logDir, controllerName);
    // If the directory is not exists then it will create new directory along with parent directory using { recursive: true }
    if (!fs.existsSync(controllerLogDirectory)) {
        fs.mkdirSync(controllerLogDirectory, { recursive: true });
    }
};

// Create a function to initialize the logger with a dynamic log level
const createLogger = (controllerName: string, logLevel: LevelWithSilent = 'info'): Logger => {
    // Ensure that the necessary directories exist before creating the logger
    ensureLogDirectory(controllerName);

    const logFilePath = path.join(logDir, controllerName, `${logLevel}.log`);

    return pino({ level: logLevel, timestamp: true }, pino.destination({ dest: logFilePath, sync: false }));
};

export default createLogger;