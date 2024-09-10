import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePostRequest,
  DeletePostRequest,
  GetPostResponse,
  GetPostsQuery,
  GetPostsResponseWithTotalCount,
  PutPostRequest,
} from './dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostRepositoryPort } from './post.repository';

export abstract class PostServiceUseCase {
  abstract getPosts(
    query: GetPostsQuery,
  ): Promise<GetPostsResponseWithTotalCount>;
  abstract createPost(body: CreatePostRequest): Promise<void>;
  abstract getPost(postId: string): Promise<GetPostResponse>;
  abstract updatePost(postId: string, body: PutPostRequest): Promise<void>;
  abstract softDeletePost(
    postId: string,
    body: DeletePostRequest,
  ): Promise<void>;
}

@Injectable()
export class PostService extends PostServiceUseCase {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly postRepo: PostRepositoryPort,
  ) {
    super();
  }

  async getPosts(
    query: GetPostsQuery,
  ): Promise<GetPostsResponseWithTotalCount> {
    throw new NotFoundException('미구현 API');
  }

  async createPost(body: CreatePostRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  async getPost(postId: string): Promise<GetPostResponse> {
    throw new NotFoundException('미구현 API');
  }

  async updatePost(postId: string, body: PutPostRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  async softDeletePost(postId: string, body: DeletePostRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}
