import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import uuidGenerator from 'src/common/helpers/uuid-generator';
import { CryptoHelper } from 'src/common/helpers/crypto.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    const user = await this.dbService.user.findUniqueOrThrow({
      where: { username },
    });
    return user ? user : null;
  }

  async create(
    user: CreateUserDto,
    role: UserRole = UserRole.ADMIN,
  ): Promise<User> {
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
        tokenVerificacion: uuidGenerator.generate(),
        refreshToken: uuidGenerator.generate(),
        active: true,
        role,
      };

      return await this.dbService.user.create({
        data: newUser,
      });
    } catch (error) {
      throw error;
    }
  }
}
