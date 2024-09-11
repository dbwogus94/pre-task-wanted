import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import {
  COMMENT_PARENT_ID,
  ErrorMessage,
  TRUE_NUMBER,
  Util,
} from '@app/common';
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
    @InjectDataSource()
    private readonly dataSource: DataSource,
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
    const existPost = await this.postRepo.existsBy({ id: body.postId });
    if (!existPost) {
      throw new NotFoundException(
        ErrorMessage.E404_COMMENT_CREATE_COMMENT_NOT_FOUND_POST,
      );
    }
    await this.commentRepo.insertOne({ ...body, parentId: COMMENT_PARENT_ID });
  }

  async getReplies(
    commentId: string,
    query: GetRepliesQuery,
  ): Promise<GetRepliesResponseWithTotalCount> {
    const existComment = await this.commentRepo.existsBy({ id: commentId });
    if (!existComment) {
      throw new NotFoundException(
        ErrorMessage.E404_COMMENT_GET_REPLIES_NOT_FOUND_COMMENT,
      );
    }

    const { limit, offset } = query;
    const [comments, totalCount] = await this.commentRepo.findManyWithCount({
      where: { parentId: commentId },
      pagination: { limit, offset },
    });

    return Util.toInstance(GetRepliesResponseWithTotalCount, {
      results: comments,
      totalCount,
    });
  }

  async createReply(
    commentId: string,
    body: CreateReplyRequest,
  ): Promise<void> {
    const comment = await this.commentRepo.findOneByPK(commentId);
    if (!comment) {
      throw new NotFoundException(
        ErrorMessage.E404_COMMENT_CREATE_REPLY_NOT_FOUND_COMMENT,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txCommentRepo = this.commentRepo.createTransactionRepo(manager);
      // 답글 생성, parentId = 댓글 ID
      await txCommentRepo.insertOne({
        ...body,
        postId: comment.postId,
        parentId: comment.id,
      });
      // 댓글 isChild = 1로 변경
      await txCommentRepo.updateOneByProperty(commentId, {
        isChild: TRUE_NUMBER,
      });

      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
