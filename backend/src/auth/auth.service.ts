import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { CryptoHelper } from 'src/common/helpers/crypto.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validate(username: string, pass: string) {
    const user = await this.usersService.findOne(username);

    if (user && (await CryptoHelper.comparePasswords(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(username: string, pass: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (await CryptoHelper.comparePasswords(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
