import { CreateUserDto } from '@/users/dto/create-user.dto';
import { OmitType } from '@nestjs/mapped-types';
import { IsInt } from 'class-validator';

export class UserResponseDto extends OmitType(CreateUserDto, [
  'password',
  'tokenVerification',
] as const) {
  @IsInt()
  id: number;
}
