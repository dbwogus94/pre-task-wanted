import { OffsetPagination, RestApiStringProperty } from '@app/common';

export class GetCommentsQuery extends OffsetPagination {
  @RestApiStringProperty({
    description: '게시글 ID',
    default: '1',
  })
  postId: string;
}
