import { CodeErrorRpcException, JsonRpcContext } from '../microservice/rpc';
import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { RPCAuthGuard } from './rpc-auth.guard';
import { LoggerService } from '../logger/logger.service';
import { HttpStatusMessage } from '../message/http-status.message';

@Injectable()
export class JWTGuard extends RPCAuthGuard('jwt') {
  private unauthorizedError = new CodeErrorRpcException(
    HttpStatusMessage.UNAUTHORIZED,
    HttpStatus.UNAUTHORIZED,
  );
  canActivate(context: ExecutionContext) {
    try {
      LoggerService.log('#JWTGuard.canActivate', JWTGuard.name);
      const authData = context
        .switchToRpc()
        .getContext<JsonRpcContext>()
        .getMetadataByKey('Authorization');
      if (!authData) {
        LoggerService.error(
          '#JWTGuard.canActivate',
          this.unauthorizedError.stack,
          JWTGuard.name,
        );
        throw this.unauthorizedError;
      }
      return super.canActivate(context);
    } catch (e) {
      throw this.unauthorizedError;
    }
  }
}
