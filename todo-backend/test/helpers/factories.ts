import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../src/module/user/user.entity';
import { GenerateUUID } from '../../src/utils';
import { ItemEntity } from '../../src/module/item/item.entity';

export const createUser = async (
  ds: DataSource,
  args?: Partial<UserEntity>,
): Promise<UserEntity> => {
  const user = new UserEntity();
  user.name = faker.internet.displayName();
  user.uuid = GenerateUUID(20);
  Object.assign(user, args);

  return ds.getRepository(UserEntity).save(user);
};

export const createItem = async (
  ds: DataSource,
  userId: number,
  args?: Partial<ItemEntity>,
): Promise<ItemEntity> => {
  const item = new ItemEntity();
  item.userId = userId;
  item.uuid = GenerateUUID(20);
  item.title = faker.word.noun();
  item.description = faker.lorem.paragraph();

  Object.assign(item, args);
  return ds.getRepository(ItemEntity).save(item);
};
