import { OffsetPagination, RestApiStringPropertyOptional } from '@app/common';

export class GetPostsQuery extends OffsetPagination {
  @RestApiStringPropertyOptional({
    description: '제목으로 검색',
    default: '제목A',
    maxLength: 255,
    minLength: 1,
  })
  title: string;

  @RestApiStringPropertyOptional({
    description: '작성자로 검색',
    default: '작성자A',
    maxLength: 100,
    minLength: 1,
  })
  authorName: string;
}
