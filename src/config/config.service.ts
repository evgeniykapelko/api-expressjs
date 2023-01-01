import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();

        if (result.error) {
            this.logger.error('[ConfigService] Not can read file .env');
        } else {
            this.logger.log('COnfig .env is loded');
            this.config = result.parsed as DotenvParseOutput;
        }
    }
    get(key: string): string {
        return this.config[key];
    }
}