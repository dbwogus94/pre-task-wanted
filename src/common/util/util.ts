import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

import { defaultPlainToInstanceOptions } from '../constant';
import { PrimitiveArrayType } from '../type';

interface Util {
  /**
   * plainToInstance를 사용하여 인스턴스를 생성한다.
   * @param cls
   * @param plain
   * @param options
   */
  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V[],
    options?: ClassTransformOptions,
  ): T[];
  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V,
    options?: ClassTransformOptions,
  ): T;
  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V | V[],
    options?: ClassTransformOptions,
  ): T | T[] | undefined;

  /**
   * null 경우만 true를 리턴한다.
   * @param value
   */
  isNull(value: any): boolean;
  isNull(value: any[]): boolean;
  /**
   *  value === null || value === undefined 경우만 true를 리턴한다.
   * @param value
   */
  isNil(value: any): boolean;
  isNil(value: any[]): boolean;

  isTruthy(value: any): boolean;
  isTruthy(value: any[]): boolean;
  isFalsy(value: any): boolean;
  isFalsy(value: any[]): boolean;

  isEmpty(array: any[]): boolean;
  isNotEmpty(array: any[]): boolean;

  /**
   * 배열에서 null 제거한 신규 배열을 리턴
   * @param array
   */
  filterNull<T>(array: T[]): T[];
  /**
   * 배열에서 null, undefined 제거한 신규 배열을 리턴
   * @param array
   */
  filterNil<T>(array: T[]): T[];
  /**
   * !!연산시 false로 판별되는 값을 제거한 신규 배열을 리턴
   * @param array
   */
  filterFalsy<T>(array: T[]): T[];

  sort(arr: PrimitiveArrayType, orderBy?: 'asc' | 'desc'): PrimitiveArrayType;

  getValues<T extends object, K extends Partial<keyof T>>(
    array: T[],
    targetProperty: K,
  ): T[K][];
}

export const Util: Util = {
  isNull(value: any | any[]): boolean {
    const isNull = (val: unknown) => val === null;
    return Array.isArray(value) ? value.every(isNull) : isNull(value);
  },
  isNil(value: any | any[]): boolean {
    const isNil = (val: unknown) => val === null || val === undefined;
    return Array.isArray(value) ? value.every(isNil) : isNil(value);
  },
  isTruthy(value: any | any[]): boolean {
    const isTruthy = (val: unknown) => !!val === true;
    return Array.isArray(value) ? value.every(isTruthy) : isTruthy(value);
  },
  isFalsy(value: any | any[]): boolean {
    return !this.isTruthy(value);
  },
  isEmpty: (array: any[]): boolean => array && array.length === 0,
  isNotEmpty: (array: any[]): boolean => array && array.length > 0,

  filterNull<T>(arr: T[]): T[] {
    return !this.isEmpty(arr) ? arr.filter((item) => !this.isNull(item)) : [];
  },
  filterNil<T>(arr: T[]): T[] {
    return !this.isEmpty(arr) ? arr.filter((item) => !this.isNil(item)) : [];
  },
  filterFalsy<T>(arr: T[]): T[] {
    return !this.isEmpty(arr) ? arr.filter((item) => !this.isFalsy(item)) : [];
  },

  toInstance<T, V>(
    cls: ClassConstructor<T>,
    plain: V | V[],
    options?: ClassTransformOptions,
  ): T | T[] | undefined {
    return plainToInstance(cls, plain, {
      ...defaultPlainToInstanceOptions,
      ...options,
    });
  },

  sort(
    arr: PrimitiveArrayType,
    orderBy: 'asc' | 'desc' = 'asc',
  ): PrimitiveArrayType {
    const ascSort = (arr: any[]) => [...arr].sort((a, b) => (a > b ? 1 : -1));
    const descSort = (arr: any[]) => [...arr].sort((a, b) => (b > a ? 1 : -1));
    return orderBy === 'asc' ? ascSort(arr) : descSort(arr);
  },

  getValues: <T extends object, K extends Partial<keyof T>>(
    array: T[],
    targetProperty: K,
  ): T[K][] => array.map((item) => item[targetProperty]),
};
