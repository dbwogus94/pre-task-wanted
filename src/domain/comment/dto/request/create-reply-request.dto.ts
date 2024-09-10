import { RestApiStringProperty } from '@app/common';
import { CommentEntity } from '@app/entity';

export class CreateReplyRequest
  implements Pick<CommentEntity, 'content' | 'authorName'>
{
  @RestApiStringProperty({
    description: '대댓글 내용',
    default: '대댓글 내용',
  })
  content: string;

  @RestApiStringProperty({
    description: '대댓글 작성자',
    default: '대댓글 작성자',
  })
  authorName: string;
}
