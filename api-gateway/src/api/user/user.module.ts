import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashService } from '../../common/encryption/hash.service';
import { AuthModule } from '../../auth/auth.module';
import { EncryptDataService } from '../../common/encryption/encrypt.service';
import { CheckEmailConstraint } from './decorator/check-email.decorator';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    UserService,
    HashService,
    EncryptDataService,
    CheckEmailConstraint,
  ],
})
export class UserModule {}
