import { BaseDomain } from '@app/common';
import { PostEntity } from '@app/entity';
import * as argon2 from 'argon2';

export interface PostProps
  extends Pick<PostEntity, 'title' | 'content' | 'authorName' | 'password'> {}

export class Post extends BaseDomain<PostProps> {
  constructor(readonly props: PostProps) {
    super(props);
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get authorName(): string {
    return this.props.authorName;
  }

  get password(): string {
    return this.props.password;
  }

  /**
   * argon2.argon2id 암호화 기법을 사용해서 암호화를 경량화 한다.
   * - argon2id는 메모리를 사용해서 암호화를 수행한다.
   * - 메모리 사용량(memoryCost)을 늘리면? 보안은 강화되고, 해싱 로직은 무거워진다.
   * - 반복횟수(timeCost)를 늘리면? 보안은 강화되고, 해싱 로직은 무거워진다.
   * - 병렬처리수준(parallelism)을 늘리면? 보안에 연관은 없고 해싱 연산 속도가 증가한다.
   * @param password
   * @returns
   */
  async hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id, // Argon2id를 사용해서 경량화된 해싱을 한다.
      memoryCost: 2 ** 12, // 메모리 사용량 (4MB)
      timeCost: 2, // 반복 횟수 2번
      parallelism: 2, // 병렬 처리 수준 CPU 2코어 사용
    });
    return hash;
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}
