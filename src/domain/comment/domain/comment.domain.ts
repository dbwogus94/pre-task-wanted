import { BaseDomain, COMMENT_PARENT_ID } from '@app/common';
import { CommentEntity } from '@app/entity';

export interface CommentProps
  extends Pick<
    CommentEntity,
    'content' | 'authorName' | 'parentId' | 'depth' | 'postId'
  > {
  /** Domain 객체에서 boolean으로 사용한다.  */
  isChild: boolean;
}

export class Comment extends BaseDomain<CommentProps> {
  constructor(readonly props: CommentProps) {
    super(props);
  }

  get content(): string {
    return this.props.content;
  }

  get authorName(): string {
    return this.props.authorName;
  }

  get parentId(): string {
    return this.props.parentId;
  }

  get depth(): number {
    return this.props.depth;
  }

  get isChild(): boolean {
    return this.props.isChild;
  }

  get postId(): string {
    return this.props.postId;
  }

  /* ============= custom ============= */
  get isComment(): boolean {
    return this.props.parentId === COMMENT_PARENT_ID;
  }

  // get isChildComment(): boolean {
  get isReply(): boolean {
    return this.props.parentId !== COMMENT_PARENT_ID;
  }
}
