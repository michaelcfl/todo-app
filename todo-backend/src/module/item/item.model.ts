import { PickType } from '@nestjs/mapped-types';
import { ItemEntity } from './item.entity';

export class ItemModel extends PickType(ItemEntity, [
  'title',
  'description',
  'done',
  'createdAt',
  'updatedAt',
] as const) {
  id: string;
  static fromEntity(entity: ItemEntity) {
    const model = new ItemModel();
    model.id = entity.uuid;
    model.title = entity.title;
    model.description = entity.description;
    model.done = entity.done;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
