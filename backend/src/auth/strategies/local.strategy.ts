import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ErrorHandler } from '@/common/helpers/error-handler.helper';
import { LoggerService } from '@/common/logger/logger.service';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<UserResponseDto> {
    try {
      const user = await this.authService.validate(username, password);

      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      ErrorHandler.handle(
        error,
        'LocalStrategy.validate',
        `Error validating user: ${username}`,
        this.logger,
      );
    }
  }
}
