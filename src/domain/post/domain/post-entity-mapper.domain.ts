import { PostEntity } from '@app/entity';
import { Post } from './post.domain';

export class PostEntityMapper {
  static toDomain(entity: PostEntity[]): Post[];
  static toDomain(entity: PostEntity): Post;
  static toDomain(entity: PostEntity | PostEntity[]): Post | Post[] {
    if (Array.isArray(entity)) {
      return entity.map((e) => this.toDomain(e));
    }

    // Note: DB와 스키마 차이 보정
    const { isComment, ...otherPost } = entity;
    return new Post({
      ...otherPost,
      isComment: !!isComment,
    }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
