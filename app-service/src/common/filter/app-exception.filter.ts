import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    console.log(exception);
    return {
      Error: {
        code: HttpStatus.BAD_REQUEST,
        message: exception.message,
      },
    };
  }
}
