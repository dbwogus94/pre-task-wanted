import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerConfig, SwaggerOptions } from '@app/config';

/**
 * nest app에 Swagger를 설정한다.
 * @param path - Swagger를 응답할 url path 지정
 * @param app - port를 열지 않은 상태의 Nest Application
 * @param options
 * @param modules - optional로 없는 경우 AppModule과 하위의 Module을 모두 사용
 * @see `@nestjs/swagger`는 반드시 `INestApplication#setGlobalPrefix('/api')` 설정 이후에 선언되어야 한다.
 * @url [nestjs 공식 문서 | openapi](https://docs.nestjs.com/openapi/introduction)
 *
 * ```
 * // NOTE: 모든 API 노출
 * setSwagger('/docs', app, apis);
 * // NOTE: user 관련 API만 노출
 * setSwagger('/docs/user', app, user, [UserModule, UserProductModule]);
 * // NOTE: admin 관련 API만 노출
 * setSwagger('/docs/admin', app, admin, [AdminModule, AdminProductModule]);
 * ```
 */
export function setSwagger(
  path: string,
  app: INestApplication,
  options: SwaggerOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
  modules: Function[] = void 0,
): void {
  const { info, securityConfig } = options;
  const { title, description, version } = info;
  const { securityOptions, name } = securityConfig;

  const documentBuilder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addBearerAuth(securityOptions, name)
    .setVersion(version);

  const swaggerConfig = documentBuilder.build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: modules,
  });
  SwaggerModule.setup(path, app, document);
}

export function builSwaggerByAll(
  basePath: string,
  app: INestApplication,
): void {
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const { apis } = swaggerConfig;
  // NOTE: 모든 API 노출
  setSwagger(basePath, app, apis);
}
