import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BaseEventListener,
  CustomLoggerService,
  OnCustomEvent,
  OnErrorEvent,
} from '@app/custom';
import { CreateCommentEvent, CreatePostEvent, CreateReplyEvent } from './event';
import { Injectable } from '@nestjs/common';

const CREATE = 'create';
const CreateEvent = {
  POST: 'create.post',
  COMMENT: 'create.comment',
  REPLY: 'create.reply',
} as const;

export abstract class CreateEventListenerPort extends BaseEventListener {
  abstract handleCreatePostEvent(event: CreatePostEvent): Promise<void>;
  abstract handleCreateCommentEvent(event: CreateCommentEvent): Promise<void>;
  abstract handleCreateReplyEvent(event: CreateReplyEvent): Promise<void>;
}

@Injectable()
export class CreateEventListener extends CreateEventListenerPort {
  static readonly EVENT_GROUP = CREATE;

  constructor(
    private readonly logger: CustomLoggerService,
    eventEmitter: EventEmitter2,
  ) {
    super(CreateEventListener.EVENT_GROUP, eventEmitter);
    this.logger.setTarget(this.constructor.name);
  }

  @OnCustomEvent(CreateEvent.POST, { async: true })
  override async handleCreatePostEvent(event: CreatePostEvent) {
    this.logger.debug(event);
  }

  @OnCustomEvent(CreateEvent.COMMENT, { async: true })
  override async handleCreateCommentEvent(event: CreateCommentEvent) {
    this.logger.debug(event);
  }
  @OnCustomEvent(CreateEvent.REPLY, { async: true })
  override async handleCreateReplyEvent(event: CreateReplyEvent) {
    this.logger.debug(event);
  }

  @OnErrorEvent(CreateEventListener.EVENT_GROUP)
  override errorHandler(err: Error): void {
    this.logger.error(err);
  }
}
