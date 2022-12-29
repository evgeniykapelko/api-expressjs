import { ILogger } from './logger.interface';
import { Logger } from 'tslog';

export class LoggerService implements ILogger {
    logger: Logger<string>;

    constructor() {
        this.logger = new Logger();
        // {
        //     displayInstanceName: true,
        //     displayLoggerName: false,
        //     displayFilePath: 'hidden',
        //     displayFunctionName: false
        // }
    }

    log(...args: unknown[]) {
        this.logger.info(...args);
    }

    error(...args: unknown[]) {
        this.logger.error(...args);
    }

    warn(...args: unknown[]) {
        this.logger.warn(...args);
    }
}