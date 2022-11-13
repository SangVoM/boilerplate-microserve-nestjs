import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MESSAGE_PATTERN } from './package';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserController {
  logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern(MESSAGE_PATTERN.CREATE)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern(MESSAGE_PATTERN.FIND_BY_EMAIL)
  async findByEmail(
    @Payload() findByEmail: FindByEmailDto,
  ): Promise<UserEntity> | null {
    return this.userService.findByEmail(findByEmail.email);
  }
}
