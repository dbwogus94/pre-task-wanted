import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtConfig } from '@app/config';
import { UserInfo } from '@app/common';
import { UserRepositoryPort } from '../user/user.repository';

type JwtPayload = Pick<UserInfo, 'uid' | 'id'>;

export abstract class AuthServiceUseCase {
  abstract decodeToken(token: string): JwtPayload | null;
  abstract issueToken(payload: JwtPayload): string;
  abstract isValid(userInfo: UserInfo): Promise<boolean>;
}

@Injectable()
export class AuthService extends AuthServiceUseCase {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryPort,
    config: ConfigService,
  ) {
    super();
    this.jwtConfig = config.get<JwtConfig>('jwt');
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const { secret, issuer, subject } = this.jwtConfig;
      return this.jwtService.verify(token, {
        secret,
        issuer, // Note: 발행자까지 일치하는지 확인한다.
        subject,
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * jwt 토큰 발급
   * @param payload
   * @returns
   */
  issueToken(payload: JwtPayload): string {
    const { secret, issuer, expiresIn, subject } = this.jwtConfig;
    return this.jwtService.sign(payload, {
      secret,
      issuer,
      expiresIn,
      subject,
    });
  }

  async isValid(userInfo: UserInfo): Promise<boolean> {
    const user = await this.userRepository.findOneByPK(userInfo.uid);
    if (!user) return false;
    if (user.token !== userInfo.jwt) return false;
    await this.userRepository.updateOneBy(user.uid, {
      accessedAt: new Date(),
    });
    return true;
  }
}
