import { BaseDto } from '../../common/dto/base.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindByIdDto extends BaseDto {
  constructor(partial: Partial<FindByIdDto>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  readonly id: string;
}
