import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Ip() ip: string) {
    return await this.authService.login(req, ip);
  }

  @Get('/logout')
  async logout(@Request() req) {
    console.log(req);
    return req.logout();
  }

  @Post('/signup')
  async register(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }
}
