import { RestApiStringProperty } from '@app/common';
import { CommentEntity } from '@app/entity';

export class CreateCommentRequest
  implements Pick<CommentEntity, 'content' | 'authorName'>
{
  @RestApiStringProperty({
    description: '댓글이 작성될 게시물 ID',
    default: '1',
  })
  postId: string;

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
}
