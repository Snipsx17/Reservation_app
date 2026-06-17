import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() req,
    @Response({ passthrough: true }) res,
    @Ip() ip: string,
  ) {
    const { refreshToken, accessToken } = await this.authService.login(req, ip);

    const refreshExpiration = this.configService.get<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION',
    );

    res.cookie('auth_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshExpiration * 1000,
    });

    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(204)
  async logout(@Request() req, @Ip() ip: string) {
    return await this.authService.logout(req, ip);
  }

  @Post('/signup')
  async register(@Body() user: CreateUserDto) {
    return await this.authService.signup(user);
  }
}
