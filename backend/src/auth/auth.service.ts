import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { CryptoHelper } from 'src/common/helpers/crypto.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validate(username: string, passwordFromRequest: string) {
    const user = await this.usersService.findOne(username);

    if (!user) return null;

    const isValidPassword = await CryptoHelper.comparePasswords(
      passwordFromRequest,
      user.password,
    );

    if (!isValidPassword) return null;

    const { password, ...result } = user;

    return result;
  }

  async login(username: string, id: string) {
    const payload = { username, sub: id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
