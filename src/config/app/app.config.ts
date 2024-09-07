import {
  InstanceValidator,
  InstanceValidatorOptional,
  IntValidator,
  StringValidator,
} from '@app/common';
import { BaseConfig } from './base.config';
import { CorsConfig } from '../cors';
import { DatabaseConfig } from '../database';
import { SwaggerConfig } from '../swagger';

export class AppConfig extends BaseConfig {
  @StringValidator()
  readonly appName: string;

  @IntValidator()
  readonly port: number;

  @InstanceValidator(CorsConfig)
  readonly cors: CorsConfig;

  @InstanceValidator(DatabaseConfig)
  readonly database: DatabaseConfig;

  @InstanceValidator(SwaggerConfig)
  readonly swagger: SwaggerConfig;
}
