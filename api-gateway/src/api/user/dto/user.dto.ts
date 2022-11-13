import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class UserDto {
  @Expose()
  public userId: number;
  @Expose()
  public email: string;
  @Expose()
  public username: string;
  @Expose()
  public password?: string;
  @Expose()
  public emailVerifiedAt: string;
  @Expose()
  public createdAt: string;
  @Expose()
  public updatedAt: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class UserShowDto {
  @Expose()
  public userId: number;
  @Expose()
  public email: string;
  @Expose()
  public username: string;
  @Expose()
  public emailVerifiedAt: string;
  @Expose()
  public createdAt: string;
  @Expose()
  public updatedAt: string;

  constructor(partial: Partial<UserShowDto>) {
    Object.assign(this, partial);
  }
}
