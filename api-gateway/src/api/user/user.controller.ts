import { METHODS, USER_NAMESPACE } from './package';
import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  JsonRpcContext,
  RpcMethod,
  RpcService,
} from '../../common/microservice/rpc';
import { BaseController } from '../../common/controller/base.controller';
import { Ctx } from '@nestjs/microservices';
import { JWTGuard } from '../../common/guard/jwt.guard';
import { UserInfo } from '../../common/guard/rpc-auth.guard';
import { UserShowDto } from './dto/user.dto';

@RpcService({
  namespace: USER_NAMESPACE,
})
@Controller()
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @RpcMethod({ name: METHODS.GET_INFO_USER })
  @UseGuards(JWTGuard)
  getInfoUser(@Ctx() context: JsonRpcContext): UserShowDto {
    return context.customData.get(UserInfo);
  }
}
