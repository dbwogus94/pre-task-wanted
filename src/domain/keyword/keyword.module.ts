import { Module } from '@nestjs/common';
import { CreateEventListener, CreateEventListenerPort } from './event-listener';

@Module({
  providers: [
    { provide: CreateEventListenerPort, useClass: CreateEventListener },
  ],
})
export class KeywordModule {}
