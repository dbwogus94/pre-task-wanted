import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToStringPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return typeof value === 'string' ? value : String(value);
  }
}
