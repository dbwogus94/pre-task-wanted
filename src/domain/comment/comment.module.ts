import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService, CommentServiceUseCase } from './comment.service';

@Module({
  controllers: [CommentController],
  providers: [{ provide: CommentServiceUseCase, useClass: CommentService }],
})
export class CommentModule {}
