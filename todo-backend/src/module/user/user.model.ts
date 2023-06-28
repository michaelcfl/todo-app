import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from './user.entity';

export class UserModel extends PickType(UserEntity, ['name'] as const) {
  id: string;

  static fromEntity(entity: UserEntity) {
    const model = new UserModel();
    model.id = entity.uuid;
    model.name = entity.name;
    return model;
  }
}
