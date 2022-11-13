import { RpcService } from '../common/microservice/rpc';
import { AUTH_NAMESPACE } from './package';
import { Controller } from '@nestjs/common';
import { BaseController } from '../common/controller/base.controller';
import { AuthService } from './auth.service';

@RpcService({
  namespace: AUTH_NAMESPACE,
})
@Controller()
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }
}
