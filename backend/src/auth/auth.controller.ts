import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(204)
  async logout(@Request() req, @Ip() ip: string) {
    return await this.authService.logout(req, ip);
  }

  @Post('/signup')
  async register(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }
}
