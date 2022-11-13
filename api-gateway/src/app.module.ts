import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import load from './common/config/load.config';
import { LoggerModule } from './common/logger/logger.module';
import { RedisMicroserviceModule } from './common/microservice/redis/redis-microservice.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [load],
    }),
    LoggerModule,
    UserModule,
    AuthModule,
    RedisMicroserviceModule,
  ],
})
export class AppModule {}
