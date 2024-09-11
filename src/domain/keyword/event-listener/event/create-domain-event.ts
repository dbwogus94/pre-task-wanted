import { DomainType } from '@app/entity';

export abstract class CreateDomainEvent {
  constructor(
    readonly type: DomainType,
    readonly id: string,
  ) {}

  static of<T extends CreateDomainEvent>(
    this: new (type: DomainType, id: string) => T,
    type: DomainType,
    id: string,
  ): T {
    return new this(type, id);
  }
}
