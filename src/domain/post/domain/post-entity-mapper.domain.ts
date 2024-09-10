import { PostEntity } from '@app/entity';
import { Post } from './post.domain';

export class PostEntityMapper {
  static toDomain(entity: PostEntity): Post {
    return new Post({ ...entity }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
