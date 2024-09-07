import { UserEntity } from '@app/entity';
import { User } from './user.domain';

export class UserEntityMapper {
  static toDomain(entity: UserEntity): User {
    return new User({ ...entity }) //
      .setBase(entity.uid, entity.id, entity.createdAt, entity.updatedAt);
  }
}
