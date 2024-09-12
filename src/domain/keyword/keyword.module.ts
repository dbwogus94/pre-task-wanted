import { Module, Provider } from '@nestjs/common';
import { CreateEventListener, CreateEventListenerPort } from './event-listener';
import {
  CreateEventQueueRepository,
  CreateEventQueueRepositoryPort,
  KeywordRepository,
  KeywordRepositoryPort,
  NotificationQueueRepository,
  NotificationQueueRepositoryPort,
} from './repository';
import { KeywordNotificationSchedule } from './keyword-notification.schedule';
import { KeywordService, KeywordServiceUseCase } from './keyword.service';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';

const repositories: Provider[] = [
  {
    provide: CreateEventQueueRepositoryPort,
    useClass: CreateEventQueueRepository,
  },
  {
    provide: NotificationQueueRepositoryPort,
    useClass: NotificationQueueRepository,
  },
  {
    provide: KeywordRepositoryPort,
    useClass: KeywordRepository,
  },
];

@Module({
  imports: [PostModule, CommentModule],
  providers: [
    { provide: KeywordServiceUseCase, useClass: KeywordService },
    ...repositories,

    { provide: CreateEventListenerPort, useClass: CreateEventListener },
    KeywordNotificationSchedule,
  ],
})
export class KeywordModule {}
