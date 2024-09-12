import { BaseDomain } from '@app/common';
import { UserKeywordAssociationEntity } from '@app/entity';

export interface UserKeywordAssociationProps
  extends Pick<UserKeywordAssociationEntity, 'keywordId' | 'userKeywordId'> {}

export class UserKeywordAssociation extends BaseDomain<UserKeywordAssociationProps> {
  constructor(readonly props: UserKeywordAssociationProps) {
    super(props);
  }

  get keywordId(): string {
    return this.props.keywordId;
  }

  get userKeywordId(): string {
    return this.props.userKeywordId;
  }
}
