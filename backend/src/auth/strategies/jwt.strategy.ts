import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DeviceFingerprintHelper } from '@/common/helpers/device-fingerprint.helper';
import { PrismaService } from '@/prisma/prisma.service';
import { LoggerService } from '@/common/logger/logger.service';
import { ErrorHandler } from '@/common/helpers/error-handler.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<any> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip || 'unknown';
    const deviceFingerprint = DeviceFingerprintHelper.create(userAgent, ip);

    try {
      const activeToken = await this.prismaService.refreshTokens.findFirst({
        where: {
          userId: payload.sub,
          token: token,
          deviceInfo: deviceFingerprint,
          active: true,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!activeToken) {
        throw new UnauthorizedException();
      }

      return { id: payload.sub, username: payload.username };
    } catch (error) {
      ErrorHandler.handle(
        error,
        'JwtStrategy.validate',
        `Error validating token or not valid ${token}`,
        this.logger,
      );
    }
  }
}
