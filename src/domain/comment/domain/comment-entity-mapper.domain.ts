import { CommentEntity } from '@app/entity';
import { Comment } from './comment.domain';

export class CommentEntityMapper {
  static toDomain(entity: CommentEntity): Comment {
    return new Comment({ ...entity }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
