import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService, CommentServiceUseCase } from './comment.service';
import { CommentRepository, CommentRepositoryPort } from './comment.repository';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [CommentController],
  providers: [
    { provide: CommentServiceUseCase, useClass: CommentService },
    { provide: CommentRepositoryPort, useClass: CommentRepository },
  ],
})
export class CommentModule {}
