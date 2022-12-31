import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { HttpStatusMessage } from '../../common/message/http-status.message';
import { CodeErrorRpcException } from '../../common/microservice/rpc';
import UserDto from '../../api/user/dto/user.dto';
import { AuthConfig } from '../../common/config/interface/auth.config';
import { UserService } from '../../api/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: readFileSync(
        join(process.cwd(), configService.get<AuthConfig>('auth').publicKey),
      ),
      algorithms: 'ES512',
      ignoreExpiration: false,
      signOptions: {
        expiresIn: configService.get<AuthConfig>('auth').expiresIn,
      },
    });
  }

  async validate(payload: any): Promise<UserDto> {
    const user = await this.userService.findOne(parseInt(payload.sub));
    if (!user) {
      throw new CodeErrorRpcException(
        HttpStatusMessage.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
