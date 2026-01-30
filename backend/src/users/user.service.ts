import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import uuidGenerator from 'src/common/helpers/uuid-generator';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly authService: AuthService,
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
        password: await this.authService.hashPassword(user.password),
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
