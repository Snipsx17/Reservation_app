import { UserRole } from '@/generated/prisma/enums';

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
  userId: any;
  token: string;
  deviceInfo: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
}
