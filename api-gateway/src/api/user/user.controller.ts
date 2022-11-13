import { METHODS } from './package';
import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RpcMethod, RpcService } from '../../common/microservice/rpc';
import { USER_NAMESPACE } from './package';
import { BaseController } from '../../common/controller/base.controller';
import { UserShowDto } from './dto/user.dto';

@RpcService({
  namespace: USER_NAMESPACE,
})
@Controller()
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @RpcMethod({ name: METHODS.REGISTER })
  create(@Body() createUserDto: CreateUserDto): Promise<UserShowDto> {
    return this.userService.create(createUserDto);
  }
}
