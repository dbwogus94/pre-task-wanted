import { DomainType } from '@app/entity';
import { CreateDomainEvent } from './create-domain-event';

export class CreateCommentEvent extends CreateDomainEvent {
  constructor(
    readonly type: DomainType,
    readonly id: string,
  ) {
    super(type, id);
  }
}
