import { RestApiIntPropertyOptional } from '../decorator';

export class OffsetPagination {
  constructor(page: number, pageSize: number) {
    this.page = page;
    this.pageSize = pageSize;
  }

  static of(param: { page: number; pageSize: number }) {
    return new OffsetPagination(param.page, param.pageSize);
  }

  @RestApiIntPropertyOptional({
    description: '페이지 번호',
    default: 1,
    min: 1,
  })
  readonly page: number = 1;

  @RestApiIntPropertyOptional({
    description: '페이지 당 아이템 개수',
    default: 10,
    min: 1,
    max: 100,
  })
  readonly pageSize: number = 10;

  get limit(): number {
    return this.pageSize;
  }

  get offset(): number {
    return (this.page - 1) * this.pageSize;
  }
}
