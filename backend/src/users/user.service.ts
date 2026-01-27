import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private dbService: PrismaService) {}

  async findOne(email: string) {
    const user = await this.dbService.superAdmin.findUnique({
      where: { email },
    });
    return user;
  }
}
