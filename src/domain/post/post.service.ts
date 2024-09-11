import { ErrorMessage, Util } from '@app/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CreatePostRequest,
  GetPostResponse,
  GetPostsQuery,
  GetPostsResponseWithTotalCount,
  PutPostRequest,
} from './dto';
import { PostRepositoryPort } from './post.repository';

export abstract class PostServiceUseCase {
  /**
   * 게시물 리스트를 조회한다.
   * - 제목 검색과 작성자 검색을 지원한다.
   * - 페이징을 지원한다.
   * @param query
   */
  abstract getPosts(
    query: GetPostsQuery,
  ): Promise<GetPostsResponseWithTotalCount>;
  /**
   * 게시물을 생성하고, 비밀번호를 암호화 하여 수정한다.
   * @param body
   * @returns
   */
  abstract createPost(body: CreatePostRequest): Promise<void>;
  abstract getPost(postId: string): Promise<GetPostResponse>;
  /**
   * 게시물이 존재하고, 비밀번호가 일치하면 수정한다.
   * @param postId
   * @param body
   */
  abstract updatePost(postId: string, body: PutPostRequest): Promise<void>;

  /**
   * 게시물이 존재하고, 비밀번호가 일치하면 soft-delete한다.
   * - 게시글에 달린 댓글, 답글도 같이 soft-delete한다.
   */
  abstract softDeletePost(postId: string, password: string): Promise<void>;
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
    const post = await this.postRepo.findOneByPK(postId);
    if (!post) {
      throw new NotFoundException(ErrorMessage.E404_APP_NOT_FOUND);
    }

    const { password, ...updateBody } = body;
    const isMatchedPassword = await post.verifyPassword(password);
    if (!isMatchedPassword) {
      throw new UnauthorizedException(ErrorMessage.E401_APP_UNAUTHORIZED);
    }
    await this.postRepo.updateOne(postId, updateBody);
  }

  async softDeletePost(postId: string, password: string): Promise<void> {
    const post = await this.postRepo.findOneByPK(postId);
    if (!post) {
      throw new NotFoundException(ErrorMessage.E404_APP_NOT_FOUND);
    }

    const isMatchedPassword = await post.verifyPassword(password);
    if (!isMatchedPassword) {
      throw new UnauthorizedException(ErrorMessage.E401_APP_UNAUTHORIZED);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txPostRepo = this.postRepo.createTransactionRepo(manager);
      // 게시물 삭제
      await txPostRepo.softDelete(postId);
      // TODO: 댓글 삭제
      // TODO: 답글 삭제
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
