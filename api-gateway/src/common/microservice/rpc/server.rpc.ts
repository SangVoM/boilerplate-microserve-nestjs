import * as express from 'express';
import * as http from 'http';

import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { ExpressAdapter } from '@nestjs/platform-express';

import { JsonRpcResponse } from './transport-types.rpc';
import { CodeErrorRpcException } from './code-error.rpc';
import { HttpServer } from '@nestjs/common';
import { invokeAsync } from './invoke.rpc';
import { TypesafeMap } from './typesafe-map.rpc';
import * as multer from 'multer';

export class JsonRpcContext {
  private _customData = new TypesafeMap();

  constructor(
    private req: express.Request,
    private server: express.Application,
  ) {}

  /**
   * Allows you to access and set custom data into individual remote procedure call contexts
   * in a type-safe way.
   *
   * To use this property, you need to instantiate a TypesafeKey.
   *
   * The following example decodes and adds user info to the context. JWT is extracted from
   * the RPC request metadata (the Authorization header for our HTTP transport)
   *
   * ```
   * import { TypesafeKey } from '@hfour/nestjs-json-rpc'
   * import { UserInfo } from './my-code';
   *
   * const UserInfoKey = new TypesafeKey<UserInfo>('myapp:auth:UserInfo');
   *
   * export class TestAuthenticateGuard implements CanActivate {
   *   public async canActivate(context: ExecutionContext): Promise<boolean> {
   *     const ctx = context.switchToRpc().getContext<JsonRpcContext>();
   *     let jwtMetadata = ctx.getMetadataByKey('Authorization');
   *     if (!jwtMetadata) return false;
   *     const decoded: Result<UserInfo> = jwt.decodeBearer(jwtMetadata);
   *     if (decoded.error) return false;
   *     ctx.customData.set(UserInfo, decoded.result)
   *     return true;
   *   }
   * }
   * ```
   */
  get customData() {
    return this._customData;
  }

  getMetadataByKey(metadataKey: string): string | undefined {
    return this.req.get(metadataKey);
  }

  getParams(): unknown {
    return this.req.body.params;
  }
}

interface HybridJsonRpcServerOptions {
  /**
   * The path at which the JSON RPC endpoint should be mounted
   */
  path: string;

  /**
   * The HTTP Server provided by the Nest runtime
   */
  adapter: HttpServer<any, any>;
}

interface StandaloneJsonRpcServerOptions {
  /**
   * Listening port for the HTTP server
   */
  port: number;

  /**
   * Listening host (optional, defaults to any)
   */
  hostname?: string;
  /*
   * The path at which the JSON RPC endpoint should be mounted
   */
  path: string;
}

export type JsonRpcServerOptions =
  | HybridJsonRpcServerOptions
  | StandaloneJsonRpcServerOptions;

/**
 * Helper to serialize JSONRPC responses
 */
function serializeResponse<T>(
  id: string,
  response: { value: T } | { error: CodeErrorRpcException },
): JsonRpcResponse<T> {
  if ('error' in response) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: response.error.code || 500,
        data: response.error.data,
        message: response.error.message,
      },
    };
  } else {
    return { jsonrpc: '2.0', id, result: response.value };
  }
}

interface IMulterRequest extends Request {
  files: any;
}

export class JsonRpcServer extends Server implements CustomTransportStrategy {
  public server: http.Server | null = null;

  /**
   * Creates a new JSON RPC Server strategy. When used to create a NestJS microservice, it will
   * expose a new microservce with a HTTP transport which implements JSON-RPC
   */
  constructor(private readonly options: JsonRpcServerOptions) {
    super();
  }

  public moveFilesToBodyRequest(req: any) {
    if (req.files) {
      if (req.body.params) {
        req.body.params = { files: req.files, ...JSON.parse(req.body.params) };
      } else {
        req.body.params = { files: req.files };
      }
    }
  }

  public async listen(callback: () => void) {
    let app: HttpServer<any, any>;

    if (this.isHybrid(this.options)) {
      app = this.options.adapter;
    } else {
      app = new ExpressAdapter(express());
      app.initHttpServer({});
    }
    /**
     * Support json rpc accept form-data and upload files
     */
    app.use(multer().any());
    app
      .getInstance()
      .post(
        this.options.path,
        express.json(),
        async (req: express.Request, res: express.Response) => {
          const handler = this.getHandlerByPattern(req.body.method);
          if (handler == null) {
            const error = new CodeErrorRpcException(
              'Method not found: ' + req.body.method,
              404,
            );
            return res
              .status(200)
              .json(serializeResponse(req.body.id, { error }));
          }
          this.moveFilesToBodyRequest(req);
          const context = new JsonRpcContext(req, app.getHttpServer());

          const observableResult = this.transformToObservable(
            await handler(req.body.params, context),
          );
          const promiseResult = observableResult.toPromise();

          const response = await promiseResult.then(
            (value) => ({ value }),
            (error) => ({ error }),
          );

          res.status(200).json(serializeResponse(req.body.id, response));
        },
      );

    await invokeAsync((cb) => {
      if (this.isStandalone(this.options)) {
        if (this.options.hostname != null) {
          this.server = app.listen(
            this.options.port,
            this.options.hostname,
            cb,
          );
        } else {
          this.server = app.listen(this.options.port, cb);
        }
      } else {
        cb();
      }
    });

    callback();
  }

  public async close() {
    // do nothing, maybe block further requests
    if (this.isStandalone(this.options)) {
      await invokeAsync((cb) => this.server && this.server.close(cb));
    }
  }

  private isHybrid(
    options: JsonRpcServerOptions,
  ): options is HybridJsonRpcServerOptions {
    return (options as HybridJsonRpcServerOptions).adapter !== undefined;
  }

  private isStandalone(
    options: JsonRpcServerOptions,
  ): options is StandaloneJsonRpcServerOptions {
    return (options as StandaloneJsonRpcServerOptions).port !== undefined;
  }
}
