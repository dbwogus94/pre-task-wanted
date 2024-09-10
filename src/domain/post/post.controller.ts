import { ApiControllerDocument } from '@app/common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { ToStringPipe } from '@app/custom';
import { DocumentHelper } from './document';
import {
  CreatePostRequest,
  DeletePostRequest,
  GetPostResponse,
  GetPostsQuery,
  GetPostsResponseWithTotalCount,
  PutPostRequest,
} from './dto';

@ApiControllerDocument('posts API')
@Controller('/posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  @DocumentHelper('getPosts')
  @Get('/')
  @HttpCode(200)
  async getPosts(
    @Query() query: GetPostsQuery,
  ): Promise<GetPostsResponseWithTotalCount> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('createPost')
  @Post('/')
  @HttpCode(204)
  async createPost(@Body() body: CreatePostRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('getPost')
  @Get('/:id')
  @HttpCode(200)
  async getPost(
    @Param('id', ParseIntPipe, ToStringPipe) postId: string,
  ): Promise<GetPostResponse> {
    throw new NotFoundException('미구현 API');
  }

  @DocumentHelper('putPost')
  @Put('/:id')
  @HttpCode(204)
  async putPost(
    @Param('id', ParseIntPipe, ToStringPipe) postId: string,
    @Body() body: PutPostRequest,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  // TODO: HTTP DELETE method에 body를 사용하는 것은 비표준이기 떄문에 이후 다른 방식으로 변경이 필요하다.
  @DocumentHelper('deletePost')
  @Delete('/:id')
  @HttpCode(204)
  async deletePost(
    @Param('id', ParseIntPipe, ToStringPipe) postId: string,
    @Body() body: DeletePostRequest,
  ): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}
