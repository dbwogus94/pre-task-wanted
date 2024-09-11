import { DomainType } from '@app/entity';
import { CreateDomainEvent } from './create-domain-event';
import { CreatePostEvent } from './create-post-event';
import { CreateCommentEvent } from './create-comment-event';
import { CreateReplyEvent } from './create-reply-event';

export class CreateDomainEventFactory {
  static createEventPayload(type: DomainType, id: string): CreateDomainEvent {
    switch (type) {
      case DomainType.POST:
        return CreatePostEvent.of(type, id);
      case DomainType.COMMENT:
        return CreateCommentEvent.of(type, id);
      case DomainType.REPLY:
        return CreateReplyEvent.of(type, id);
      default:
        throw new Error(`Unsupported domain type: ${type}`);
    }
  }
}
