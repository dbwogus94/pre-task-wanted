import { UserEntity } from '@app/entity';
import { BaseDomain } from 'src/domain/base.domain';

export interface UserProps extends UserEntity {}

export class User extends BaseDomain<UserProps> {
  constructor(readonly props: UserProps) {
    super(props);
  }

  get nickname(): string {
    return this.id ? this.props.nickname : '0000';
  }

  get token(): string {
    return this.props.token;
  }

  get accessedAt(): Date {
    return this.props.accessedAt;
  }

  /* ================== method ================== */

  /**
   * 닉네임 생성
   * - 000 + id,
   * - default 0000
   */
  generateNickname(): this {
    switch (this.id.toString().length) {
      case 1:
        this.props.nickname = `00${this.id}`;
        return this;
      case 2:
        this.props.nickname = `0${this.id}`;
        return this;
      default:
        this.props.nickname = `${this.id}`;
        return this;
    }
  }
}
