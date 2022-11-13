import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisMicroserviceModule } from '../../common/microservice/redis/redis-microservice.module';
import { HashService } from '../../common/encryption/hash.service';
import { AuthModule } from '../../auth/auth.module';
import { EncryptDataService } from '../../common/encryption/encrypt.service';

@Module({
  imports: [forwardRef(() => AuthModule), RedisMicroserviceModule],
  controllers: [UserController],
  providers: [UserService, HashService, EncryptDataService],
})
export class UserModule {}
