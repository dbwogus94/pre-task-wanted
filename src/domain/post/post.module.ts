import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService, PostServiceUseCase } from './post.service';
import { PostRepository, PostRepositoryPort } from './post.repository';

@Module({
  controllers: [PostController],
  providers: [
    { provide: PostServiceUseCase, useClass: PostService },
    { provide: PostRepositoryPort, useClass: PostRepository },
  ],
  exports: [PostRepositoryPort],
})
export class PostModule {}
