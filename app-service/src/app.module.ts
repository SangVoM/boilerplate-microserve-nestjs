import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import config from './common/config';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB.DB_CONNECTION'),
        host: configService.get<string>('DB.DB_HOST'),
        port: configService.get<number>('DB.DB_PORT'),
        username: configService.get<string>('DB.DB_USERNAME'),
        password: configService.get<string>('DB.DB_PASSWORD'),
        database: configService.get<string>('DB.DB_DATABASE'),
        schema: configService.get<string>('DB.DB_SCHEMA'),
        entities: [
          join(__dirname, '**/entities/*{.entity.ts,.entity.js}'),
          join(__dirname, '**/data/*{.entity.ts,.entity.js}'),
        ],
        logging: configService.get<boolean>('DB.DB_LOGGING'),
        synchronize: configService.get<string>('DB.DB_SYNCHRONIZE') === 'true',
        cache: true,
      }),
    }),
    UserModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
