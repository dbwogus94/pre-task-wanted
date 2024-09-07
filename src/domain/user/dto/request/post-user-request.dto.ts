import { PartialType, PickType } from '@nestjs/swagger';
import { Equals } from 'class-validator';

import { RestApiBooleanProperty } from '@app/common';
import { UserEntity } from '@app/entity';

export class PostUserRequestDTO extends PickType(PartialType(UserEntity), [
  'nickname',
]) {
  @RestApiBooleanProperty({
    description: '약관 동의(false 불가)',
    default: true,
  })
  @Equals(true)
  agreementTerms: true;
}
