import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LoggerService } from './common/logger/logger.service';
import { OutboundResponseIdentitySerializer } from './common/serializer/outbound-response.serializer';
import { InboundMessageIdentityDeserializer } from './common/serializer/inbound-message.deserializer';
import { AppExceptionFilter } from './common/filter/app-exception.filter';
import { RPCValidationPipe } from './common/pipe/rpc-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Number(Transport.REDIS),
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        no_ready_check: false,
        serializer: new OutboundResponseIdentitySerializer(),
        deserializer: new InboundMessageIdentityDeserializer(),
      },
      logger: new LoggerService(),
    },
  );
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalPipes(new RPCValidationPipe());
  await app.listen();
  LoggerService.log('🌍 App Service is running', app['logger'].context);
}

(async () => await bootstrap())();
