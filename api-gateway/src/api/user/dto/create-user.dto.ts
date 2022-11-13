import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../decorator/match.decorator';
import { CheckEmailExits } from '../decorator/check-email.decorator';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  username: string;

  @CheckEmailExits({ message: 'User is exists' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(255)
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Match('password', { message: 'passwordConfirm must match password' })
  passwordConfirm: string;
}
