import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRequest, ErrorMessage } from '@app/common';
import { AuthServiceUseCase } from '../auth.service';
import { BaseJwtGuard } from './base-jwt.guard';

@Injectable()
export class JwtGuard extends BaseJwtGuard {
  constructor(private readonly authService: AuthServiceUseCase) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest<UserRequest>(context);
    const jwt = this.getJwt(request);
    if (!jwt)
      throw new UnauthorizedException(ErrorMessage.E401_APP_UNAUTHORIZED);

    const payload = this.authService.decodeToken(jwt);
    if (!payload)
      throw new UnauthorizedException(ErrorMessage.E401_APP_UNAUTHORIZED);

    const userInfo = { uid: payload.uid, id: payload.id, jwt };
    const isValid = await this.authService.isValid(userInfo);
    if (!isValid)
      throw new UnauthorizedException(ErrorMessage.E401_APP_UNAUTHORIZED);

    request.user = userInfo;
    return true;
  }
}
