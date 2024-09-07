import { PartialType, PickType } from '@nestjs/swagger';

import { UserEntity } from '@app/entity';

export class PatchUserRequestDTO extends PickType(PartialType(UserEntity), [
  'nickname',
]) {}
