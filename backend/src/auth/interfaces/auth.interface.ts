import { User } from '@/generated/prisma/client';
import { UserRole } from '@/generated/prisma/enums';
import { Request } from 'express';

export interface IValidateResponse {
  id: number;
  userId: string;
  username: string;
  email: string;
  verifiedEmail: boolean;
  telephone: string;
  tokenVerification: string;
  refreshToken: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface ILoginResponse {
  access_token: string;
}

export interface IUserActiveToken {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  token: string;
  deviceInfo: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
}

export interface ITokenData {
  userId: number;
  token: string;
  deviceInfo: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
}

export interface ILoginData {
  username: string;
  id: number;
  userAgent: string;
  ip: string;
  deviceFingerprint: string;
}

export interface ILogoutData {
  userAgent: string;
  authToken: string;
}

export interface IJwtTokenPayload {
  username: string;
  sub: number;
  iat: number;
  exp: number;
}

export interface IRequestWithUser extends Request {
  user: User;
}

export interface ITokenStrategy {
  type: string;
  existingToken?: IUserActiveToken;
}
