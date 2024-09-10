import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiControllerDocument } from '@app/common';
import { DocumentHelper } from './document';
import { ToStringPipe } from '@app/custom';
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
  @DocumentHelper('getComments')
  @Get('/')
  @HttpCode(200)
  async getComments(
    @Query() query: GetCommentsQuery,
  ): Promise<GetCommentsResponseWithTotalCount> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('createComment')
  @Post('/')
  @HttpCode(204)
  async createComment(@Body() body: CreateCommentRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('getReplies')
  @Get('/:id/replies')
  @HttpCode(200)
  async getReplies(
    @Param('id', ParseIntPipe, ToStringPipe) commentId: string,
    @Query() query: GetRepliesQuery,
  ): Promise<GetRepliesResponseWithTotalCount> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('createReply')
  @Post('/:id/replies')
  @HttpCode(204)
  async createReply(
    @Param('id', ParseIntPipe, ToStringPipe) commentId: string,
    @Body() body: CreateReplyRequest,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}
