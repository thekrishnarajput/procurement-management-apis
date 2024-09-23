import pino, { LevelWithSilent, Logger } from "pino";
import createLogger from "./loggerInitializer";
import { LoggerType } from "../enums/loggerTypes";

export const printLogger = async (loggerType: LevelWithSilent, message: string, moduleName: string, controllerName: string) => {
    const logger: Logger = createLogger(controllerName, loggerType);
    switch (loggerType) {
        case LoggerType.error:
            logger.error({ module: moduleName }, message);
            break;
        case LoggerType.debug:
            logger.debug({ module: moduleName }, message);
            break;
        case LoggerType.info:
            logger.info({ module: moduleName }, message);
            break;
        case LoggerType.warn:
            logger.warn({ module: moduleName }, message);
        default:
            logger.info({ module: moduleName }, message);
    }
};