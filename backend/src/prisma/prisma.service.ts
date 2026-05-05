import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { LoggerService } from '@/common/logger/logger.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly localLogger = new Logger();

  constructor(private readonly logger: LoggerService) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`;
      this.localLogger.log(`✅ Connected to DB`, 'PrimaService');
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error('❌ Error in connection with DB', error.code);
        this.localLogger.error(
          `❌ Error in connection with DB - ${error.code}`,
          'PrimaService',
        );
      }
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Application disconnected to PostgreSQL');
  }
}
