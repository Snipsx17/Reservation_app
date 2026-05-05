import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User, UserRole } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import uuidGenerator from '@/common/helpers/uuid-generator';
import { CryptoHelper } from '@/common/helpers/crypto.helper';
import { ConfigService } from '@nestjs/config';
import { ErrorHandler } from '@/common/helpers/error-handler.helper';
import { LoggerService } from '@/common/logger/logger.service';
import { UserResponseDto } from '@/auth/dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    try {
      const user = await this.dbService.user.findUnique({
        where: { username },
      });
      return user ? user : null;
    } catch (error) {
      ErrorHandler.handle(
        error,
        'userService.findOne',
        `Error during login`,
        this.logger,
      );
    }
  }

  async create(
    user: CreateUserDto,
    role: UserRole = UserRole.ADMIN,
  ): Promise<UserResponseDto> {
    try {
      const userExist = await this.findOne(user.username);

      if (userExist) throw new ConflictException('User already exists');

      const newUser = {
        ...user,
        password: await CryptoHelper.hashPassword(
          user.password,
          this.configService.get<number>('JWT_SALT_ROUNDS'),
        ),
        verifiedEmail: false,
        tokenVerification: uuidGenerator.generate(),
        refreshToken: uuidGenerator.generate(),
        active: true,
        role,
      };

      const newDbUser = await this.dbService.user.create({
        data: newUser,
      });

      if (!user) return null;

      return plainToClass(UserResponseDto, newDbUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      ErrorHandler.handle(
        error,
        'userService.create',
        `Error creating new User`,
        this.logger,
      );
    }
  }
}
