import { HttpException } from '@nestjs/common';

export class ErrorUtil {
  static isServerError(error: Error | unknown) {
    return !(error instanceof HttpException);
  }
}
