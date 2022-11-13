import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ACTION_TYPE } from './package';
import { EncryptDataService } from '../common/encryption/encrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private encryptDataService: EncryptDataService,
  ) {}

  generateTokenAction(user: any, actionType: ACTION_TYPE, expiresIn?: number) {
    if (!expiresIn) expiresIn = 3600000;
    const payload = {
      data: { userId: user.userId, email: user.email },
      actionType,
      expiresIn: new Date().getTime() + expiresIn,
    };

    return this.encryptDataService.encrypt(JSON.stringify(payload));
  }
}
