import { CommentEntity } from '@app/entity';
import { Comment } from './comment.domain';

export class CommentEntityMapper {
  static toDomain(entity: CommentEntity[]): Comment[];
  static toDomain(entity: CommentEntity): Comment;
  static toDomain(
    entity: CommentEntity | CommentEntity[],
  ): Comment | Comment[] {
    if (Array.isArray(entity)) {
      return entity.map((e) => this.toDomain(e));
    }

    // Note: DB와 스키마 차이 보정
    const { isChild, ...otherComment } = entity;
    return new Comment({ ...otherComment, isChild: !!isChild }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
