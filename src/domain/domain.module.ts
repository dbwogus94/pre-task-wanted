import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { KeywordModule } from './keyword/keyword.module';

@Module({
  imports: [PostModule, CommentModule, KeywordModule],
})
export class DomainModule {}
