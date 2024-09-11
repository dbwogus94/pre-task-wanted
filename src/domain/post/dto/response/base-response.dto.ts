import { BaseResponse, RestApiStringProperty } from '@app/common';
import { PostEntity } from '@app/entity';

export class BasePostResponse
  extends BaseResponse
  implements
    Omit<PostEntity, 'password' | 'isComment' | 'comments' | 'deletedAt'>
{
  @RestApiStringProperty({
    description: '제목',
    default: 'title',
    maxLength: 255,
    minLength: 3,
  })
  title: string;

  @RestApiStringProperty({
    description: '본문',
    default: 'content',
    minLength: 3,
  })
  content: string;

  @RestApiStringProperty({
    description: '작성자',
    default: 'authorName',
    maxLength: 100,
    minLength: 1,
  })
  authorName: string;
}
