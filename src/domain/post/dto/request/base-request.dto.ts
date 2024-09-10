import { RestApiStringProperty } from '@app/common';
import { PostEntity } from '@app/entity';

export class BasePostRequest
  implements Pick<PostEntity, 'title' | 'content' | 'authorName' | 'password'>
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

  @RestApiStringProperty({
    description: '작성 비밀번호',
    default: 'password',
    maxLength: 255,
    minLength: 5,
  })
  password: string;
}
