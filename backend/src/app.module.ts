import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app/app.controller';
import configuration from './config/configuration';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot(configuration), LoggerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
