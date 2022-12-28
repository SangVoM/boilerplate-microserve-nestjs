import { RpcMethod, RpcService } from '../common/microservice/rpc';
import { AUTH_NAMESPACE, METHODS } from './package';
import { Body, Controller } from '@nestjs/common';
import { BaseController } from '../common/controller/base.controller';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { CreateUserDto } from '../api/user/dto/create-user.dto';
import { UserShowDto } from '../api/user/dto/user.dto';

@RpcService({
  namespace: AUTH_NAMESPACE,
})
@Controller()
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @RpcMethod({ name: METHODS.LOGIN })
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(loginRequestDto);
  }

  @RpcMethod({ name: METHODS.REGISTER })
  create(@Body() createUserDto: CreateUserDto): Promise<UserShowDto> {
    return this.authService.create(createUserDto);
  }
}
