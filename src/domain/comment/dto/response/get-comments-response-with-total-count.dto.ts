import {
  BaseResponse,
  RestApiBooleanProperty,
  RestApiInstanceProperty,
  RestApiStringProperty,
  WithTotolCountResponse,
} from '@app/common';
import { CommentEntity } from '@app/entity';

export class GetCommentsResponse
  extends BaseResponse
  implements Omit<CommentEntity, 'deletedAt' | 'parentId' | 'depth' | 'post'>
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

  @RestApiBooleanProperty({
    description: '댓글에 답글 존재 유무',
    default: false,
  })
  isChild: number;
}

export class GetCommentsResponseWithTotalCount extends WithTotolCountResponse {
  @RestApiInstanceProperty(GetCommentsResponse, {
    description: '댓글 리스트',
    isArray: true,
    arrayMinSize: 0,
  })
  results: GetCommentsResponse[];
}
