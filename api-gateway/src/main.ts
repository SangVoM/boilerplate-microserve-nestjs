import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { OpenRpcConfig } from './common/config/interface/open-rpc.config';
import { JsonRpcServer } from './common/microservice/rpc';
import { LoggerService } from './common/logger/logger.service';
import { AppConfig } from './common/config/interface/app.config';
import { useContainer } from 'class-validator';
import { UserModule } from './api/user/user.module';

function settingJsonRPC(app: INestApplication, config: ConfigService) {
  const openRPCConfig = config.get<OpenRpcConfig>('openRPC');
  if (openRPCConfig.enable) {
    app.connectMicroservice(
      {
        strategy: new JsonRpcServer({
          path: openRPCConfig.path,
          adapter: app.getHttpAdapter(),
        }),
      },
      { inheritAppConfig: true },
    );
  }
}

async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.enableCors({
    origin: '*',
    methods: 'POST',
    optionsSuccessStatus: 200,
  });
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  settingJsonRPC(app, configService);
  await app.startAllMicroservices();

  useContainer(app.select(UserModule), { fallbackOnErrors: true });
  await app.listen(appConfig.port, appConfig.host);

  logger.log(
    `🌍 API Gateway is running at http://${appConfig.host}:${appConfig.port}`,
    app['logger'].context,
  );
}

(async () => await bootstrap())();
