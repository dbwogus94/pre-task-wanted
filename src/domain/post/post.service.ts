import { ErrorMessage, Util } from '@app/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CreatePostRequest,
  DeletePostRequest,
  GetPostResponse,
  GetPostsQuery,
  GetPostsResponseWithTotalCount,
  PutPostRequest,
} from './dto';
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
    const { title, authorName, limit, offset } = query;
    if (title && authorName) {
      throw new ConflictException(
        ErrorMessage.E409_POST_TITLE_AND_AUTHOR_CONFLICT,
      );
    }

    const [results, totalCount] = await this.postRepo.findManyWithCount({
      where: { title, authorName },
      pagination: { limit, offset },
    });
    return Util.toInstance(GetPostsResponseWithTotalCount, {
      totalCount,
      results,
    });
  }

  async createPost(body: CreatePostRequest): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txPostRepo = this.postRepo.createTransactionRepo(manager);
      const { password, ...other } = body;
      const newPostId = await txPostRepo.insertOne({ ...other, password: '' });
      const newPost = await txPostRepo.findOneByPK(newPostId);

      // 비밀번호 해싱 수행
      const hashPassword = await newPost.hashPassword(password);
      await txPostRepo.updateOneByProperty(newPostId, {
        password: hashPassword,
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

  async getPost(postId: string): Promise<GetPostResponse> {
    const post = await this.postRepo.findOneByPK(postId);
    if (!post) {
      throw new NotFoundException(ErrorMessage.E404_APP_NOT_FOUND);
    }
    return Util.toInstance(GetPostResponse, post);
  }

  async updatePost(postId: string, body: PutPostRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
  }

  async softDeletePost(postId: string, body: DeletePostRequest): Promise<void> {
    throw new NotFoundException('미구현 API');
  }
}
