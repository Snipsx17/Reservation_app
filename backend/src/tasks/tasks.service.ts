import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly dbService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    name: 'Clean expired refresh tokens',
    timeZone: 'Europe/Madrid',
  })
  async handleCron() {
    await this.dbService.refreshTokens.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });
  }
}
