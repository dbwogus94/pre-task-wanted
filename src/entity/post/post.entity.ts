import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { CommentEntity } from './comment.entity';

@Entity('post')
@Index('ft_index_post_title', ['title'], {
  fulltext: true,
  parser: 'ngram',
})
@Index('ft_index_post_content', ['content'], {
  fulltext: true,
  parser: 'ngram',
})
export class PostEntity extends BaseEntity {
  @Column('varchar', { length: 255, comment: '제목' })
  title: string;

  @Column('text', { comment: '본문' })
  content: string;

  @Column('varchar', { length: 100, comment: '작성자 이름' })
  authorName: string;

  @Column('varchar', { length: 255, comment: '비밀번호' })
  password: string;

  /* ============= 연관관계 ============= */
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
}
