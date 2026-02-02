import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/generated/prisma/enums';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password is too weak. Must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol.',
    },
  )
  password: string;

  @IsPhoneNumber()
  telephone: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsBoolean()
  verifiedEmail?: boolean;

  @IsOptional()
  @IsString()
  tokenVerificacion?: string;
}
