import { Injectable, NotFoundException } from '@nestjs/common';

import { COMMENT_PARENT_ID, ErrorMessage, Util } from '@app/common';
import { PostRepositoryPort } from '../post/post.repository';
import { CommentRepositoryPort } from './comment.repository';
import {
  CreateCommentRequest,
  CreateReplyRequest,
  GetCommentsQuery,
  GetCommentsResponseWithTotalCount,
  GetRepliesQuery,
  GetRepliesResponseWithTotalCount,
} from './dto';

export abstract class CommentServiceUseCase {
  abstract getComments(
    query: GetCommentsQuery,
  ): Promise<GetCommentsResponseWithTotalCount>;
  abstract createComment(body: CreateCommentRequest): Promise<void>;

  abstract getReplies(
    commentId: string,
    query: GetRepliesQuery,
  ): Promise<GetRepliesResponseWithTotalCount>;
  abstract createReply(
    commentId: string,
    body: CreateReplyRequest,
  ): Promise<void>;
}

@Injectable()
export class CommentService extends CommentServiceUseCase {
  constructor(
    private readonly commentRepo: CommentRepositoryPort,
    private readonly postRepo: PostRepositoryPort,
  ) {
    super();
  }

  async getComments(
    query: GetCommentsQuery,
  ): Promise<GetCommentsResponseWithTotalCount> {
    const { postId, limit, offset } = query;
    const [comments, totalCount] = await this.commentRepo.findManyWithCount({
      where: { postId, parentId: COMMENT_PARENT_ID },
      pagination: { limit, offset },
    });

    return Util.toInstance(GetCommentsResponseWithTotalCount, {
      results: comments,
      totalCount,
    });
  }

  async createComment(body: CreateCommentRequest): Promise<void> {
    const post = await this.postRepo.existsBy({ id: body.postId });
    if (!post) {
      throw new NotFoundException(ErrorMessage.E404_COMMENT_POST_NOT_FOUND);
    }
    const { postId, ...other } = body;
    await this.commentRepo.insertOne(postId, other);
  }

  async getReplies(
    commentId: string,
    query: GetRepliesQuery,
  ): Promise<GetRepliesResponseWithTotalCount> {
    throw new NotFoundException('미구현 API');
  }

  async createReply(
    commentId: string,
    body: CreateReplyRequest,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}
