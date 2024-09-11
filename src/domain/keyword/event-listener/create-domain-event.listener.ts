import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BaseEventListener,
  CustomLoggerService,
  OnCustomEvent,
  OnErrorEvent,
} from '@app/custom';
import { CreateCommentEvent, CreatePostEvent, CreateReplyEvent } from './event';
import { Injectable } from '@nestjs/common';
import { CreateEventQueueRepositoryPort } from '../repository';

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
    private readonly createEventQueueRepo: CreateEventQueueRepositoryPort,
    eventEmitter: EventEmitter2,
  ) {
    super(CreateEventListener.EVENT_GROUP, eventEmitter);
    this.logger.setTarget(this.constructor.name);
  }

  /**
   * 게시글 생성 이벤트 헨들러
   * @param event
   */
  @OnCustomEvent(CreateEvent.POST, { async: true })
  override async handleCreatePostEvent(event: CreatePostEvent) {
    this.logger.debug(`On Handle Event - ${CreateEvent.POST}`);
    const { id, type } = event;
    await this.createEventQueueRepo.insertOne({
      domainId: id,
      domainTypeCode: type,
    });
  }

  /**
   * 댓글 생성 이벤트 헨들러
   * @param event
   */
  @OnCustomEvent(CreateEvent.COMMENT, { async: true })
  override async handleCreateCommentEvent(event: CreateCommentEvent) {
    this.logger.debug(`On Handle Event - ${CreateEvent.COMMENT}`);
    const { id, type } = event;
    await this.createEventQueueRepo.insertOne({
      domainId: id,
      domainTypeCode: type,
    });
  }

  /**
   * 답글 생성 이벤트 헨들러
   * @param event
   */
  @OnCustomEvent(CreateEvent.REPLY, { async: true })
  override async handleCreateReplyEvent(event: CreateReplyEvent) {
    this.logger.debug(`On Handle Event - ${CreateEvent.REPLY}`);
    const { id, type } = event;
    await this.createEventQueueRepo.insertOne({
      domainId: id,
      domainTypeCode: type,
    });
  }

  @OnErrorEvent(CreateEventListener.EVENT_GROUP)
  override errorHandler(err: Error): void {
    this.logger.error(err);
  }
}
