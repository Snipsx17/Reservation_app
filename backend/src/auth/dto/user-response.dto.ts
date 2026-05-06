import { CreateUserDto } from '@/users/dto/create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UserResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
