import { LoggerService } from '@nestjs/common';
import { utilities, WinstonModule, WinstonModuleOptions } from 'nest-winston';
import * as Winston from 'winston';

type NpmLogLevels = typeof Winston.config.npm.levels;
type Env = 'production' | 'development' | 'local';
type Options = {
  env?: Env;
};

/** `@nestjs/common`의 LoggerService를 생성하는 빌더 클래스  */
export class WinstonLoggerServiceBuiler {
  readonly #logLevels: NpmLogLevels;
  #winstonModuleOptions: WinstonModuleOptions;

  private constructor() {
    this.#logLevels = Winston.config.npm.levels;
  }

  static create() {
    return new this();
  }

  setWinstonModuleOptions(appName: string, options: Options = {}) {
    this.#winstonModuleOptions =
      options.env === 'production'
        ? this.#getProductionConfig(appName)
        : this.#getDevelopmentConfig(appName);
    return this;
  }

  build(): LoggerService {
    return WinstonModule.createLogger(this.#winstonModuleOptions);
  }

  #getProductionConfig(appName: string): WinstonModuleOptions {
    return {
      levels: this.#logLevels,
      level: this.#getNpmLogLevelName(this.#logLevels.info),
      format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.ms(),
        utilities.format.nestLike(appName, {
          prettyPrint: true,
          colors: false,
          appName: true,
        }),
      ),
      transports: [
        new Winston.transports.Console(),
        new Winston.transports.File({
          filename: 'logs/app.log',
          level: 'info',
        }),
      ],
    };
  }

  #getDevelopmentConfig(appName: string): WinstonModuleOptions {
    return {
      /* 커스텀 레벨 목록 설정 */
      levels: this.#logLevels,
      /* 설정한 로그 레벨 이하만 출력 */
      level: this.#getNpmLogLevelName(this.#logLevels.debug),
      /* 출력 포멧 설정 */
      format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.ms(), // 이전 로그와 다음로그 시간차 출력

        // nest-winston에서 제공하는 utilities는 nestjs의 logger에 연동하기 위해 사용된다.
        utilities.format.nestLike(appName, {
          prettyPrint: true,
          colors: true, // colors: false => 색상 없음
          appName: true,
        }),
      ),
      /* 생성한 로그를 어디에 출력(전송)할지 설정 */
      transports: [new Winston.transports.Console()],
    };
  }

  #getNpmLogLevelName(level: number): string {
    const reverseLevelsKeyValue: Record<string, string> = Object.fromEntries(
      Object.entries(this.#logLevels).reduce(
        (acc, [key, value]) => acc.set(value.toString(), key),
        new Map(),
      ),
    );
    const logLevelName = reverseLevelsKeyValue[level];
    if (!logLevelName) {
      throw new Error(`matched Npm Log Levels not exist`);
    }
    return logLevelName;
  }
}
