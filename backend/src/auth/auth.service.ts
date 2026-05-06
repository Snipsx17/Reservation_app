import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/user.service';
import { CryptoHelper } from '@/common/helpers/crypto.helper';
import { DeviceFingerprintHelper } from '@/common/helpers/device-fingerprint.helper';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@/common/logger/logger.service';
import { MAX_ACTIVE_TOKENS } from '@/common/constants';
import { ErrorHandler } from '@/common/helpers/error-handler.helper';
import {
  ILoginData,
  ILoginResponse,
  IRequestWithUser,
  ITokenData,
  ITokenStrategy,
  IUserActiveToken,
} from './interfaces/auth.interface';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async validate(
    username: string,
    passwordFromRequest: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.usersService.findOne(username);

      if (!user) return null;

      const isValidPassword = await CryptoHelper.comparePasswords(
        passwordFromRequest,
        user.password,
      );

      if (!isValidPassword) return null;

      const result = plainToClass(UserResponseDto, user, {
        excludePrefixes: ['password', 'tokenVerification'],
      });

      return result;
    } catch (error) {
      ErrorHandler.handle(
        error,
        'AuthService.validate',
        `Error validating user: ${username}`,
        this.logger,
      );
    }
  }

  async login(req: IRequestWithUser, ip: string): Promise<ILoginResponse> {
    try {
      const loginData = this.extractLoginData(req, ip);
      const tokenPayload = this.prepareTokenPayload(loginData);

      // get all active tokens (ascending ordered)
      const activeTokens = await this.findUserActiveTokens(loginData.id);

      await this.handleTokenStrategy(activeTokens, tokenPayload, loginData);

      return { access_token: tokenPayload.token };
    } catch (error) {
      ErrorHandler.handle(
        error,
        'AuthService.login',
        `Error when login User: ${req.user?.username || 'unknown'}`,
        this.logger,
      );
    }
  }

  private extractLoginData(req: IRequestWithUser, ip: string): ILoginData {
    const { username, id } = req.user;
    const userAgent = req.headers['user-agent'] || 'unknown';

    this.logLoginAttempt(username, ip);

    if (!username || !id) {
      throw new BadRequestException('Invalid user data');
    }

    return {
      username,
      id,
      userAgent,
      ip,
      deviceFingerprint: DeviceFingerprintHelper.create(userAgent, ip),
    };
  }

  private prepareTokenPayload(loginData: ILoginData): ITokenData {
    const { id, username, deviceFingerprint, ip, userAgent } = loginData;

    const refreshTokenExpiration = this.configService.get<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION',
    );

    if (!refreshTokenExpiration) {
      throw new InternalServerErrorException(
        'Token configuration not available',
      );
    }

    return {
      userId: id,
      token: this.createNewAccessToken(username, id),
      deviceInfo: deviceFingerprint,
      userAgent,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + refreshTokenExpiration),
    };
  }

  private logLoginAttempt(username: string, ip: string) {
    this.logger.log(
      `User ${username} attempting login from IP: ${ip}`,
      'AuthService.login',
    );
  }

  private createNewAccessToken(username: string, sub: number): string {
    return this.jwtService.sign({ username, sub });
  }

  private async findUserActiveTokens(
    userId: number,
  ): Promise<IUserActiveToken[]> {
    try {
      return await this.prismaService.refreshTokens.findMany({
        where: {
          userId,
          active: true,
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      ErrorHandler.handle(
        error,
        'AuthService.findUserActiveTokens',
        `Error finding User active tokens for user ID: ${userId || 'unknown'}`,
        this.logger,
      );
    }
  }

  private async handleTokenStrategy(
    activeTokens: IUserActiveToken[],
    tokenData: ITokenData,
    loginData: ILoginData,
  ) {
    const strategy = this.determineTokenStrategy(
      activeTokens,
      tokenData.deviceInfo,
    );

    switch (strategy.type) {
      case 'CREATE_FIRST':
        await this.createFirstToken(tokenData, loginData.username);
        break;
      case 'UPDATE_EXISTING':
        await this.updateExistingDeviceToken(
          strategy.existingToken.id,
          tokenData,
          loginData.username,
        );
        break;
      case 'REPLACE_OLDEST':
        await this.replaceOldestToken(
          activeTokens[0].id,
          tokenData,
          loginData.username,
        );
        break;
      case 'CREATE_NEW':
        await this.createNewToken(tokenData, loginData.username);
        break;
    }
  }

  private determineTokenStrategy(
    activeTokens: IUserActiveToken[],
    deviceFingerprint: string,
  ): ITokenStrategy {
    if (activeTokens.length === 0) {
      return { type: 'CREATE_FIRST' };
    }

    const existingToken = activeTokens.find(
      (token) => token.deviceInfo === deviceFingerprint,
    );
    if (existingToken) {
      return { type: 'UPDATE_EXISTING', existingToken };
    }

    if (activeTokens.length >= MAX_ACTIVE_TOKENS) {
      return { type: 'REPLACE_OLDEST' };
    }

    return { type: 'CREATE_NEW' };
  }

  private async createFirstToken(tokenData: ITokenData, username: string) {
    await this.createRefreshToken(tokenData);
    this.logger.log(`First token created for user ${username}`, 'AuthService');
  }

  private async replaceOldestToken(
    oldTokenId: number,
    tokenData: ITokenData,
    username: string,
  ) {
    await this.replaceOldestTokenWithNew(oldTokenId, tokenData);
    this.logger.log(`Oldest token replaced - User: ${username}`, 'AuthService');
  }

  private async createNewToken(tokenData: ITokenData, username: string) {
    await this.createRefreshToken(tokenData);
    this.logger.log(`New token created - User: ${username}`, 'AuthService');
  }

  private async updateExistingDeviceToken(
    tokenId: number,
    tokenData: ITokenData,
    username: string,
  ) {
    await this.updateRefreshToken(tokenId, tokenData);
    this.logger.log(
      `Updated token for this device - User: ${username}`,
      'AuthService',
    );
  }

  private async createRefreshToken(tokenData: ITokenData): Promise<void> {
    try {
      await this.prismaService.refreshTokens.create({
        data: tokenData,
      });
    } catch (error) {
      ErrorHandler.handle(
        error,
        'AuthService.login',
        `Error creating refresh token to user ID: ${tokenData.userId || 'unknown'}`,
        this.logger,
      );
    }
  }

  private async updateRefreshToken(tokenId: number, tokenData: ITokenData) {
    try {
      await this.prismaService.refreshTokens.update({
        where: { id: tokenId },
        data: {
          token: tokenData.token,
          expiresAt: tokenData.expiresAt,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      ErrorHandler.handle(
        error,
        'AuthService.createRefreshToken',
        `Error updating refresh token to user ID: ${tokenData.userId || 'unknown'}`,
        this.logger,
      );
    }
  }

  private async deleteOldestToken(tokenId: number): Promise<void> {
    try {
      await this.prismaService.refreshTokens.delete({
        where: { id: tokenId },
      });
    } catch (error) {
      ErrorHandler.handle(
        error,
        'AuthService.deleteOldestToken',
        `Error deleting oldest token: ${tokenId || 'unknown'}`,
        this.logger,
      );
    }
  }

  private async replaceOldestTokenWithNew(
    oldTokenId: number,
    newTokenData: any,
  ) {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        // DELETE: delete oldest
        await prisma.refreshTokens.delete({
          where: { id: oldTokenId },
        });

        // CREATE: new token
        await prisma.refreshTokens.create({
          data: newTokenData,
        });
      });
    } catch (error) {
      ErrorHandler.handle(
        error,
        'AuthService.replaceOldestTokenWithNew',
        `Error replacing oldest token`,
        this.logger,
      );
    }
  }
}
