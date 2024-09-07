import { ko } from 'date-fns/locale';
import * as Fns from 'date-fns';

interface DateUtil {
  getYear(date?: Date): number;
  getMonth(date?: Date): number;
  getDays(date?: Date): number;

  toFormat(date?: Date, format?: string): string;
  /**
   * 입력받은 date의 시, 분, 초, ms를 최대로 변경한다.
   * ex)
   * - input 2023-01-01 13:24:20.123
   * - output 2023-01-01 23:59:59.999
   * @param date
   * @returns
   */
  toEndOfDay(date?: Date): Date;
  /**
   * 입력받은 date의 시, 분, 초, ms를 최소로 변경한다.
   * ex)
   * - input 2023-01-01 13:24:20.123
   * - output 2023-01-01 00:00:00.000
   * @param date
   * @returns
   */
  toStartOfDay(date?: Date): Date;
}

export const DateUtil: DateUtil = {
  getYear: (date?: Date): number => Fns.getYear(date ?? new Date()),
  getMonth: (date?: Date): number => Fns.getMonth(date ?? new Date()),
  getDays: (date?: Date): number => Fns.getDate(date ?? new Date()),

  toFormat: (
    date: Date = new Date(),
    format = 'yyyy-MM-dd HH:mm:ss.SSS',
  ): string =>
    Fns.format(date, format, {
      locale: ko,
    }),
  toEndOfDay: (date: Date = new Date()): Date => Fns.endOfDay(date),
  toStartOfDay: (date: Date = new Date()): Date => Fns.startOfDay(date),
};
