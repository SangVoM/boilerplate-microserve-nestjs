import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  constructor(partial: Partial<LoginRequestDto>) {
    Object.assign(this, partial);
  }

  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @MaxLength(32)
  @MinLength(6)
  @IsNotEmpty()
  public readonly password: string;
}
