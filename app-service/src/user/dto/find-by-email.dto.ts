import { BaseDto } from '../../common/dto/base.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindByEmailDto extends BaseDto {
  constructor(partial: Partial<FindByEmailDto>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  readonly email: string;
}
