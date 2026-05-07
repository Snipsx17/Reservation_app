import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { LoggerService } from '../logger/logger.service';

export class ErrorHandler {
  static handle(
    error: any,
    context: string,
    customMessage?: string,
    logger?: LoggerService,
  ): never {
    const logMessage = customMessage || 'Operation failed';

    if (logger) {
      logger.error(`${logMessage} - ${error.message}`, error.stack, context);
    }

    // Re-throw known exceptions
    if (
      error instanceof BadRequestException ||
      error instanceof InternalServerErrorException ||
      error instanceof UnauthorizedException
    ) {
      throw error;
    }

    // Handle Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      throw new InternalServerErrorException('Database operation failed');
    }

    // Default error
    throw new InternalServerErrorException(error.message);
  }
}
