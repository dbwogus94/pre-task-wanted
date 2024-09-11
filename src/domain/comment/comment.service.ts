import { Injectable, NotFoundException } from '@nestjs/common';

import {
  CreateCommentRequest,
  CreateReplyRequest,
  GetCommentsQuery,
  GetCommentsResponseWithTotalCount,
  GetRepliesQuery,
  GetRepliesResponseWithTotalCount,
} from './dto';
import { CommentRepositoryPort } from './comment.repository';

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
  constructor(private readonly commentRepo: CommentRepositoryPort) {
    super();
  }

  async getComments(
    query: GetCommentsQuery,
  ): Promise<GetCommentsResponseWithTotalCount> {
    throw new NotFoundException('미구현 API');
  }

  async createComment(body: CreateCommentRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
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
