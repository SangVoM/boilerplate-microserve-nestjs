import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AuthConfig } from '../common/config/interface/auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../api/user/user.service';
import { EncryptDataService } from '../common/encryption/encrypt.service';
import { HashService } from '../common/encryption/hash.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: readFileSync(
          join(process.cwd(), configService.get<AuthConfig>('auth').privateKey),
        ),
        publicKey: readFileSync(
          join(process.cwd(), configService.get<AuthConfig>('auth').publicKey),
        ),
        signOptions: {
          algorithm: 'ES512',
          expiresIn: `${configService.get<AuthConfig>('auth').expiresIn}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, EncryptDataService, HashService],
  exports: [AuthService],
})
export class AuthModule {}
