import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app/app.controller';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot(configuration)],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
