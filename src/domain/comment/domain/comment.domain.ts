import { CommentEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export interface CommentProps extends CommentEntity {}

export class Comment extends BaseDomain<CommentProps> {
  constructor(readonly props: CommentProps) {
    super(props);
  }
}
