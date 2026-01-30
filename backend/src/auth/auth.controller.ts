import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    const { username, id } = req.user;
    return this.authService.login(username, id);
  }

  @Get('auth/logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @Post('auth/signup')
  async register(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }
}
