import { BaseDomain } from '@app/common';
import { KeywordEntity } from '@app/entity';

export interface KeywordProps extends Pick<KeywordEntity, 'name'> {}

export class Keyword extends BaseDomain<KeywordProps> {
  constructor(readonly props: KeywordProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }
}
