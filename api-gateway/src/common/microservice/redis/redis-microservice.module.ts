import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_CLIENT } from './redis';
import { OutboundResponseIdentitySerializer } from './serializers/outbound-response.serializer';
import { InboundMessageIdentityDeserializer } from './serializers/inbound-message.deserializer';
import { RedisConfig } from '../../config/interface/redis.config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: REDIS_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const redisConfig = configService.get<RedisConfig>('redis');
          return {
            transport: Transport.REDIS,
            options: {
              host: redisConfig.host,
              port: redisConfig.port,
              password: redisConfig.password,
              no_ready_check: true,
              serializer: new OutboundResponseIdentitySerializer(),
              deserializer: new InboundMessageIdentityDeserializer(),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RedisMicroserviceModule {}
