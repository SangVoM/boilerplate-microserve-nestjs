import { LoggerService } from './logger.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [LoggerService],
})
export class LoggerModule {}
