import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindByEmailDto {
  constructor(partial: Partial<FindByEmailDto>) {
    Object.assign(this, partial);
  }

  @IsNotEmpty()
  @IsEmail()
  public readonly email: string;
}
