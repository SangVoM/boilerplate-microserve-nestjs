import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ACTION_TYPE } from './package';
import { EncryptDataService } from '../common/encryption/encrypt.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserService } from '../api/user/user.service';
import { HashService } from '../common/encryption/hash.service';
import { CodeErrorRpcException } from '../common/microservice/rpc';
import { HttpStatusMessage } from '../common/message/http-status.message';
import { responseBuilder } from '../common/dto/response/response.dto';
import { JWTResponseDto } from './dto/jwt-response.dto';
import { AuthConfig } from '../common/config/interface/auth.config';
import UserDto, { UserShowDto } from '../api/user/dto/user.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { AppConfig } from '../common/config/interface/app.config';
import { join } from 'path';
import { CreateUserDto } from '../api/user/dto/create-user.dto';
import { MESSAGE_PATTERN } from './package';
import { lastValueFrom } from 'rxjs';
import { REDIS_CLIENT } from '../common/microservice/redis/redis';
import { ClientRedis } from '@nestjs/microservices';
export const BEARER_TYPE = 'Bearer';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private encryptDataService: EncryptDataService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private hashService: HashService,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly clientRedis: ClientRedis,
  ) {}

  async login(loginRequestDto: LoginRequestDto) {
    try {
      const { email, password } = loginRequestDto;
      const user = await this.userService.findByEmail({ email });
      if (!user) {
        throw new CodeErrorRpcException(
          HttpStatusMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const comparePassword = this.hashService.compare(password, user.password);
      if (!comparePassword) {
        throw new CodeErrorRpcException(
          HttpStatusMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return responseBuilder(JWTResponseDto, {
        type: BEARER_TYPE,
        accessToken: await this.generateAccessToken(user),
        expiresIn:
          new Date().getTime() +
          this.configService.get<AuthConfig>('auth').expiresIn * 1000,
      });
    } catch (e) {
      throw new CodeErrorRpcException(
        HttpStatusMessage.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserShowDto> | null {
    createUserDto.password = this.hashService.make(createUserDto.password);
    const userClientProxy = this.clientRedis.send(
      MESSAGE_PATTERN.CREATE,
      createUserDto,
    );
    const user = await lastValueFrom(userClientProxy);

    return responseBuilder(UserShowDto, user);
  }

  generateTokenAction(user: any, actionType: ACTION_TYPE, expiresIn?: number) {
    if (!expiresIn) expiresIn = 3600000;
    const payload = {
      data: { userId: user.userId, email: user.email },
      actionType,
      expiresIn: new Date().getTime() + expiresIn,
    };

    return this.encryptDataService.encrypt(JSON.stringify(payload));
  }

  async generateAccessToken(user: UserDto): Promise<string> {
    const payload = { username: user.username };
    const opts: JwtSignOptions = {
      privateKey: readFileSync(
        join(
          process.cwd(),
          this.configService.get<AuthConfig>('auth').privateKey,
        ),
      ),
      algorithm: 'ES512',
      issuer: this.configService.get<AppConfig>('app').url,
      audience: this.configService.get<AppConfig>('app').url,
      subject: `${user.userId}`,
    };

    return this.jwtService.sign(payload, opts);
  }
}
