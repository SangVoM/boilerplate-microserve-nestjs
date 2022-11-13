import { RpcException } from '@nestjs/microservices';

export class CodeErrorRpcException extends RpcException {
  /**
   * Create a new RPC exception
   *
   * @param message The error message
   * @param code The error code (Defaults to 500)
   * @param data Any additional data that should be passed to the client
   */
  constructor(
    message: string,
    public code: number = 500,
    public data: any = {},
  ) {
    super({ message, code, data });
  }
}
