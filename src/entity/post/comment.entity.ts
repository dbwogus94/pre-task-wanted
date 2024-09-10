import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { PostEntity } from './post.entity';

@Entity('comment')
@Index('ft_index_comment_content', ['content'], {
  fulltext: true,
  parser: 'ngram',
})
export class CommentEntity extends BaseEntity {
  @Column('bigint', { comment: '게시물 id' })
  postId: string;

  @Column('text', { comment: '댓글 내용' })
  content: string;

  @Column('varchar', { length: 100, comment: '댓글 작성자 이름' })
  authorName: string;

  @Column('bigint', { comment: '부모 댓글 id, 0: 최상위 댓글', default: 0 })
  parentId: string;

  @Column('int', { comment: '댓글 깊이, 0: 최상위 댓글', default: 0 })
  depth: number;

  @Column('tinyint', { comment: '자식 댓글 존재 유무', default: 0 })
  isChild: number;

  /* ============= 연관관계 ============= */
  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;
}
