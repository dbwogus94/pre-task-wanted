import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import { EnvUtil, getTypeOrmModuleAsyncOptions } from '@app/common';
import { AppConfig, LocalConfig, ProdConfig } from '@app/config';
import { DevelopmentGlobalProviders, GlobalModule } from '@app/custom';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './domain';

const config = EnvUtil.isProd() ? ProdConfig : LocalConfig;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [() => AppConfig.validate(config)],
    }),
    TypeOrmModule.forRootAsync(getTypeOrmModuleAsyncOptions()),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    GlobalModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...DevelopmentGlobalProviders],
})
export class AppModule {}
