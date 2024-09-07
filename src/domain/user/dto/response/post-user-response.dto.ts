import { PickType } from '@nestjs/swagger';

import { RestApiStringProperty, defaultResponseProperties } from '@app/common';
import { UserEntity } from '@app/entity';

export class PostUserResponseDTO extends PickType(UserEntity, [
  ...defaultResponseProperties,
  'nickname',
]) {
  @RestApiStringProperty({
    description: 'jwt 토큰',
    default: 'jwt',
  })
  token: string;
}
