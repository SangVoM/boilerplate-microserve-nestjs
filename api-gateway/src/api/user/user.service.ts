import { forwardRef, Inject, Injectable } from '@nestjs/common';
import UserDto from './dto/user.dto';
import { REDIS_CLIENT } from '../../common/microservice/redis/redis';
import { ClientRedis } from '@nestjs/microservices';
import { HashService } from '../../common/encryption/hash.service';
import { MESSAGE_PATTERN } from './package';
import { responseBuilder } from '../../common/dto/response/response.dto';
import { AuthService } from '../../auth/auth.service';
import { FindByEmailDto } from '../../auth/dto/find-by-email.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly clientRedis: ClientRedis,
    private readonly hashService: HashService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findByEmail(findByEmailDto: FindByEmailDto): Promise<UserDto> | null {
    const userClientProxy = this.clientRedis.send(
      MESSAGE_PATTERN.FIND_BY_EMAIL,
      findByEmailDto,
    );
    const user = await lastValueFrom(userClientProxy);

    return responseBuilder(UserDto, user);
  }

  async findOne(id: number): Promise<UserDto> | null {
    const userClientProxy = await this.clientRedis.send(
      MESSAGE_PATTERN.FIND_BY_ID,
      { id },
    );
    const user = await lastValueFrom(userClientProxy);

    return responseBuilder(UserDto, user);
  }
}
