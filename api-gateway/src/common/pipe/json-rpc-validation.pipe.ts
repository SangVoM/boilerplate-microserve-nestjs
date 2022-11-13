import {
  Injectable,
  HttpStatus,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { HttpStatusMessage } from '../message/http-status.message';
import { CodeErrorRpcException } from '../microservice/rpc';
import { arrayNotEmpty } from 'class-validator';

@Injectable()
export class JsonRPCValidationPipe extends ValidationPipe {
  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new CodeErrorRpcException('Validate Errors');
      }
      const errors = this.buildValidationErrorsMessage(validationErrors);
      return new CodeErrorRpcException(
        HttpStatusMessage.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
        errors,
      );
    };
  }

  public buildValidationErrorsMessage(validationErrors: ValidationError[]) {
    const errorMsg = {};
    validationErrors.map((ve) => {
      if (arrayNotEmpty(ve.children)) {
        const subErrorMsg = {};
        ve.children.map((sve) => {
          if (arrayNotEmpty(sve.children)) {
            const childSubErrorMsg = {};
            sve.children.map((child) => {
              childSubErrorMsg[child.property] = [
                ...Object.values(child.constraints),
              ];
            });
            subErrorMsg[sve.property] = childSubErrorMsg;
          } else {
            subErrorMsg[sve.property] = [...Object.values(sve.constraints)];
          }
        });
        errorMsg[ve.property] = subErrorMsg;
      } else {
        errorMsg[ve.property] = [...Object.values(ve.constraints)];
      }
    });
    return errorMsg;
  }
}
