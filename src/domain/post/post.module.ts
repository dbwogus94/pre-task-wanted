import { forwardRef, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService, PostServiceUseCase } from './post.service';
import { PostRepository, PostRepositoryPort } from './post.repository';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [forwardRef(() => CommentModule)],
  controllers: [PostController],
  providers: [
    { provide: PostServiceUseCase, useClass: PostService },
    { provide: PostRepositoryPort, useClass: PostRepository },
  ],
  exports: [PostRepositoryPort],
})
export class PostModule {}
