import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Logger,
  mixin,
  Optional,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';
import {
  AuthModuleOptions,
  IAuthGuard,
  IAuthModuleOptions,
} from '@nestjs/passport';
import { memoize } from '@nestjs/passport/dist/utils/memoize.util';
import { defaultOptions } from '@nestjs/passport/dist/options';
import { CodeErrorRpcException, TypesafeKey } from '../microservice/rpc';
import { HttpStatusMessage } from '../message/http-status.message';
import { UserShowDto } from '../../api/user/dto/user.dto';
import { USER_NAMESPACE } from '../../api/user/package';

export const UserInfo = new TypesafeKey<UserShowDto>(USER_NAMESPACE);
export const RPCAuthGuard: (type?: string | string[]) => Type<IAuthGuard> =
  memoize(createRPCAuthGuard);

const NO_STRATEGY_ERROR = `In order to use "defaultStrategy", please, ensure to import PassportModule in each place where AuthGuard() is being used. Otherwise, passport won't work correctly.`;

function createRPCAuthGuard(type?: string | string[]): Type<CanActivate> {
  class MixinAuthGuard<TUser = any> implements CanActivate {
    @Optional()
    @Inject(AuthModuleOptions)
    protected options: AuthModuleOptions = {};
    constructor(@Optional() options?: AuthModuleOptions) {
      this.options = options ?? this.options;
      if (!type && !this.options.defaultStrategy) {
        new Logger('AuthGuard').error(NO_STRATEGY_ERROR);
      }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const options = {
        ...defaultOptions,
        ...this.options,
        ...this.getAuthenticateOptions(),
      };
      const [request, response] = [
        this.getRequest(context),
        this.getResponse(context),
      ];
      const passportFn = createPassportContext(request, response);
      console.log(request)
      await passportFn(
        type || this.options.defaultStrategy,
        options,
        (err, user, info, status) => {
          console.log('LOG: ', user, info);
          this.handleRequest(err, user, info, context, status);
        },
      );
      return true;
    }

    /**
     * Get request full header from RPC context
     * @param context
     */
    getRequest<T = any>(context: ExecutionContext): T {
      return context.switchToRpc().getContext()['req'];
    }
    /**
     * Get response from RPC context
     * @param context
     */
    getResponse<T = any>(context: ExecutionContext): T {
      return context.switchToRpc().getContext()['res'];
    }
    async logIn<TRequest extends { logIn: (...args: any[]) => void } = any>(
      request: TRequest,
    ): Promise<void> {
      const user = request[this.options.property || defaultOptions.property];
      await new Promise<void>((resolve, reject) =>
        request.logIn(user, (err) => (err ? reject(err) : resolve())),
      );
    }

    handleRequest(err, user, info, context: ExecutionContext, status): TUser {
      if (err || !user || !context.switchToRpc() || !info || !status) {
        throw err || new UnauthorizedException();
      }
      return user;
    }

    getAuthenticateOptions(): IAuthModuleOptions | undefined {
      return undefined;
    }
  }
  return mixin(MixinAuthGuard);
}

const createPassportContext =
  // eslint-disable-next-line @typescript-eslint/ban-types
  (request, response) => (type, options, callback: Function) =>
    new Promise<void>((resolve, reject) =>
      passport.authenticate(type, options, (err, user, info, status) => {
        try {
          request.authInfo = info;
          return resolve(callback(err, user, info, status));
        } catch (err) {
          reject(err);
          // throw new CodeErrorRpcException(
          //   HttpStatusMessage.UNAUTHORIZED,
          //   HttpStatus.UNAUTHORIZED,
          // );
        }
      })(request, response, (err) => (err ? reject(err) : resolve())),
    );
