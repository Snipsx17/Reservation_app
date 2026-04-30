import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User, UserRole } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import uuidGenerator from '@/common/helpers/uuid-generator';
import { CryptoHelper } from '@/common/helpers/crypto.helper';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    try {
      const user = await this.dbService.user.findUnique({
        where: { username },
      });
      return user ? user : null;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new InternalServerErrorException('Error during login');
      throw new InternalServerErrorException();
    }
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
        tokenVerification: uuidGenerator.generate(),
        refreshToken: uuidGenerator.generate(),
        active: true,
        role,
      };

      return await this.dbService.user.create({
        data: newUser,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new InternalServerErrorException('Error during login');

      throw new InternalServerErrorException();
    }
  }
}
