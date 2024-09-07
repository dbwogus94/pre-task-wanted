import { IsArray, IsNotEmpty } from 'class-validator';
import { EntitySchema, LoggerOptions, MixedList } from 'typeorm';

import {
  BooleanValidator,
  InstanceValidator,
  IntValidator,
  StringValidator,
} from '@app/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { PoolOptions as Mysql2PoolOptions } from 'mysql2';

/**
 * mysql2 connection pool option
 * @see [mysql2 공식문서](https://sidorares.github.io/node-mysql2/docs#using-connection-pools)
 */
class PoolOptions implements Mysql2PoolOptions {
  @BooleanValidator()
  waitForConnections? = true; // true: 최대 커넥션을 모두 소비하면 요청을 대기열에 넣는다.

  @IntValidator()
  connectionLimit: number; //

  @IntValidator()
  queueLimit?: number = 0; // 최대 대기열 수, 기본 0으로 무제한

  /* 작동하지 않음  */
  // @IntValidator()
  // idleTimeout: number; // 대기열에 들어간 쿼리 강제 취소 시간 '0'이면 무제한. ex) 60000 = 1분 이상 쿼리 강제 취소

  // @IntValidator()
  // maxIdle: number; // 대기열에 들어갈 최대 커넥션 수 (Default: same as `connectionLimit`)
}

export class DatabaseConfig implements MysqlConnectionOptions {
  @StringValidator()
  readonly type = 'mysql' as const;

  @StringValidator()
  readonly connectorPackage = 'mysql2' as const;

  @StringValidator()
  readonly host: string;

  @IntValidator()
  readonly port: number = 5432;

  @StringValidator()
  readonly username: string;

  @StringValidator()
  readonly password: string;

  @StringValidator()
  readonly database: string;

  @IsNotEmpty()
  @IsArray()
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly entities?: MixedList<Function | string | EntitySchema> = [
    `${__dirname}/../**/*.entity{.ts,.js}`,
  ];

  @StringValidator({}, { each: true })
  readonly migrations?: string[] = [`${__dirname}/../migrations/**/*{.ts,.js}`];

  @BooleanValidator()
  readonly ssl?: boolean = false;

  @BooleanValidator()
  readonly synchronize?: boolean = false;

  @BooleanValidator()
  readonly dropSchema?: boolean = false;

  @BooleanValidator()
  readonly migrationsRun?: boolean = false;

  @StringValidator()
  readonly migrationsTableName?: string = 'migrations' as const;

  @IsNotEmpty()
  readonly logging?: LoggerOptions = 'all';

  @IntValidator()
  readonly maxQueryExecutionTime: number; // 지연 로그 출력 시간(ms), ex) 10000 = 10초 이상 쿼리 로그 출력

  @InstanceValidator(PoolOptions)
  readonly extra: PoolOptions;
}
