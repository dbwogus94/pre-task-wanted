import { OffsetPagination, RestApiStringPropertyOptional } from '@app/common';

export class GetPostsQuery extends OffsetPagination {
  @RestApiStringPropertyOptional({
    description: '제목으로 검색',
    maxLength: 255,
    minLength: 1,
  })
  title?: string | null;

  @RestApiStringPropertyOptional({
    description: '작성자로 검색',
    maxLength: 100,
    minLength: 1,
  })
  authorName?: string | null;
}
