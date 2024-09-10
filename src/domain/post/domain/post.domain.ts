import { BaseDomain } from '@app/common';
import { PostEntity } from '@app/entity';

export interface PostProps extends PostEntity {}

export class Post extends BaseDomain<PostProps> {
  constructor(readonly props: PostProps) {
    super(props);
  }
}
