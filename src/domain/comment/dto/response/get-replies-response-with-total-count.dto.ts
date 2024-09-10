import {
  BaseResponse,
  RestApiInstanceProperty,
  RestApiStringProperty,
  WithTotolCountResponse,
} from '@app/common';
import { CommentEntity } from '@app/entity';

export class GetRepliesResponse
  extends BaseResponse
  implements Omit<CommentEntity, 'deletedAt' | 'depth' | 'isChild' | 'post'>
{
  @RestApiStringProperty({
    description: '댓글 내용',
    default: '댓글 내용',
  })
  content: string;

  @RestApiStringProperty({
    description: '댓글 작성자',
    default: '댓글 작성자',
  })
  authorName: string;

  @RestApiStringProperty({
    description: '댓글의 부모 ID',
    default: '1',
  })
  parentId: string;
}

export class GetRepliesResponseWithTotalCount extends WithTotolCountResponse {
  @RestApiInstanceProperty(GetRepliesResponse, {
    description: '대댓글 리스트',
    isArray: true,
    arrayMinSize: 0,
  })
  results: GetRepliesResponse[];
}
