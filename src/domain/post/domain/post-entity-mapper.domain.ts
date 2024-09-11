import { PostEntity } from '@app/entity';
import { Post } from './post.domain';

export class PostEntityMapper {
  static toDomain(entity: PostEntity[]): Post[];
  static toDomain(entity: PostEntity): Post;
  static toDomain(entity: PostEntity | PostEntity[]): Post | Post[] {
    if (Array.isArray(entity)) {
      return entity.map((e) => this.toDomain(e));
    }

    return new Post({ ...entity }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
