import { UsePipes } from '@nestjs/common';
import { JsonRPCValidationPipe } from '../pipe/json-rpc-validation.pipe';

@UsePipes(
  new JsonRPCValidationPipe({
    stopAtFirstError: true,
  }),
)
export abstract class BaseController {}
