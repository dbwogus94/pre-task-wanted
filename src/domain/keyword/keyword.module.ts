import { Module, Provider } from '@nestjs/common';
import { CreateEventListener, CreateEventListenerPort } from './event-listener';
import {
  CreateEventQueueRepository,
  CreateEventQueueRepositoryPort,
  NotificationQueueRepository,
  NotificationQueueRepositoryPort,
} from './repository';

const repositories: Provider[] = [
  {
    provide: CreateEventQueueRepositoryPort,
    useClass: CreateEventQueueRepository,
  },
  {
    provide: NotificationQueueRepositoryPort,
    useClass: NotificationQueueRepository,
  },
];

@Module({
  providers: [
    { provide: CreateEventListenerPort, useClass: CreateEventListener },
    ...repositories,
  ],
})
export class KeywordModule {}
