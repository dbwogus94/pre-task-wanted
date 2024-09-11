import { ApiControllerDocument } from '@app/common';
import { ToStringPipe } from '@app/custom';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommentServiceUseCase } from './comment.service';
import { DocumentHelper } from './document';
import {
  CreateCommentRequest,
  CreateReplyRequest,
  GetCommentsQuery,
  GetCommentsResponseWithTotalCount,
  GetRepliesQuery,
  GetRepliesResponseWithTotalCount,
} from './dto';

@ApiControllerDocument('comments api')
@Controller('comment')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentServiceUseCase) {}

  @DocumentHelper('getComments')
  @Get('/')
  @HttpCode(200)
  async getComments(
    @Query() query: GetCommentsQuery,
  ): Promise<GetCommentsResponseWithTotalCount> {
    return await this.commentService.getComments(query);
  }

  @DocumentHelper('createComment')
  @Post('/')
  @HttpCode(204)
  async createComment(@Body() body: CreateCommentRequest): Promise<void> {
    await this.commentService.createComment(body);
  }

  @DocumentHelper('getReplies')
  @Get('/:id/replies')
  @HttpCode(200)
  async getReplies(
    @Param('id', ParseIntPipe, ToStringPipe) commentId: string,
    @Query() query: GetRepliesQuery,
  ): Promise<GetRepliesResponseWithTotalCount> {
    return await this.commentService.getReplies(commentId, query);
  }

  @DocumentHelper('createReply')
  @Post('/:id/replies')
  @HttpCode(204)
  async createReply(
    @Param('id', ParseIntPipe, ToStringPipe) commentId: string,
    @Body() body: CreateReplyRequest,
  ): Promise<void> {
    await this.commentService.createReply(commentId, body);
  }
}
