import { HttpStatusMessage } from '../../message/http-status.message';
import { plainToClass } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { CodeErrorRpcException } from '../../microservice/rpc';
import { isString } from 'class-validator';

export class ResponseDto {
  statusCode: number;
  message: any;
  timestamp: string;
  path?: string;
  error?: any;
  data?: any;

  constructor(partial: Partial<ResponseDto> | any) {
    Object.assign(this, partial);
  }
}

export function responseBuilder<T, V>(cls: ClassConstructor<T>, plain: V): T {
  if (plain && plain['Error']) {
    const error = JSON.parse(JSON.stringify(plain['Error']));
    throw new CodeErrorRpcException(
      error['code'] == HttpStatus.BAD_REQUEST
        ? HttpStatusMessage.BAD_REQUEST
        : HttpStatusMessage.INTERNAL_SERVER_ERROR,
      error['code'],
      isString(error['message'])
        ? error['message']
        : JSON.parse(error['message']),
    );
  }
  return plainToClass(cls, plain ?? '');
}
