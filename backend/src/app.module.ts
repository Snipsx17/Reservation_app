import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { UsersService } from './users/user.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(configuration),
    LoggerModule,
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
