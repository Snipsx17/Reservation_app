import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private dbService: PrismaService) {}

  async findOne(username: string) {
    const user = await this.dbService.superAdmin.findUnique({
      where: { username },
    });
    return user;
  }
}
