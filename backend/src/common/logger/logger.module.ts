import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './logger.config';

@Global()
@Module({
  imports: [WinstonModule.forRoot(loggerConfig)],
  exports: [LoggerService],
  providers: [LoggerService],
})
export class LoggerModule {}
