import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import helmet from 'helmet';

import {
  DEFALUT_APP_NAME,
  WinstonLoggerServiceBuiler,
  defaultGlobalValidationPipeOptions,
  setSwagger,
} from '@app/common';
import { CorsConfig, SwaggerConfig } from '@app/config';
import { httpLogger } from '@app/custom';
import { AppModule } from './app.module';

async function bootstrap() {
  const appName = process.env.APP_NAME ?? DEFALUT_APP_NAME;
  const nodeEnv = (process.env.NODE_ENV as any) ?? 'local';

  const app = await NestFactory.create<INestApplication>(AppModule, {
    logger: WinstonLoggerServiceBuiler.create()
      .setWinstonModuleOptions(appName, { env: nodeEnv })
      .build(),
  });

  const configService = app.get(ConfigService);
  const corsConfig = configService.getOrThrow<CorsConfig>('cors');
  const swaggerConfig = configService.getOrThrow<SwaggerConfig>('swagger');

  // Note: setGlobalPrefix는 setSwagger 이전에 선언해야, 생성된 swagger-json에 반영된다.
  app.setGlobalPrefix('/api');
  setMiddleware(app, { httpLogging: true, corsConfig });
  setSwagger('/docs', app, swaggerConfig.apis);

  await app
    .useGlobalPipes(new ValidationPipe(defaultGlobalValidationPipeOptions))
    .listen(configService.get('port'));
}

bootstrap();

/**
 * Express middleware 적용
 * @param app
 * @param options
 *
 * 적용되는 미들웨어
 * - cors 적용
 * - helmet 적용
 * - json limit size 50mb 적용
 * - `options.httpLogging === true`면 httpLogging 적용
 */
function setMiddleware(
  app: INestApplication,
  options: { corsConfig?: CorsConfig; httpLogging?: boolean } = {
    corsConfig: { origin: '*' },
  },
) {
  const { origin } = options.corsConfig;
  app.enableCors({
    origin: typeof origin === 'string' ? origin.split(',') : origin,
  });
  app.use(helmet());
  app.use(json({ limit: '50mb' }));

  if (!!options.httpLogging) {
    const logger = app.get(Logger);
    app.use(httpLogger(logger));
  }
}
