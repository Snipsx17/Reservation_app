import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { ErrorHandler } from '@/common/helpers/error-handler.helper';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    name: 'Clean expired refresh tokens',
    timeZone: 'Europe/Madrid',
  })
  async handleCron() {
    try {
      await this.dbService.refreshTokens.deleteMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
    } catch (error) {
      ErrorHandler.handle(
        error,
        'TaskService.handleCron',
        `Error creating cron task`,
        this.logger,
      );
    }
  }
}
