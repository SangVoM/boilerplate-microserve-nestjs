import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseService } from '../common/services/base.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { LoggerService } from '../common/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity, UserRepository> {
  constructor(
    @InjectRepository(UserRepository) repository: UserRepository,
    logger: LoggerService,
  ) {
    super(repository, logger);
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.repository.findOneOrFail({ email });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.repository.save(createUserDto);
  }
}
