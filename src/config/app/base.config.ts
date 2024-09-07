import { Logger } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { DeepPartial, ObjectLiteral } from '@app/common';

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor<T = Record<string, any>> = new () => T;

export class BaseConfig {
  public static validate<T extends ObjectLiteral>(
    this: Constructor,
    record: DeepPartial<T>,
  ): Record<string, any> {
    const klass = plainToInstance(this, record, {
      // Note: 생성된 인스턴스가 default 데이터를 제거하지 않고 사용하도록 설정
      exposeDefaultValues: true,
    });
    const errors = validateSync(klass);

    if (errors.length > 0) {
      Logger.error(
        `[BaseConfig] Error ${Logger.getTimestamp()} \t` +
          errors.map((v) => v.toString()).toString(),
      );
      throw new Error('[BaseConfig] Configuration Validation Error Occured');
    }

    return instanceToPlain(klass);
  }
}
