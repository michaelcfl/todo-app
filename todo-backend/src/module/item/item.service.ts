import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemEntity } from './item.entity';
import { CreateItemDTO, UpdateItemDTO } from './item.dto';
import omit from 'lodash/omit';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateUUID } from '../../utils';
import {
  PagingInterface,
  SortingInterface,
} from '../../interface/paging.interface';

interface ItemServiceInterface {
  create(userId: number, body: CreateItemDTO): Promise<ItemEntity>;

  update(
    userId: number,
    itemId: string,
    body: UpdateItemDTO,
  ): Promise<ItemEntity>;

  getOne(userId: number, uuid: string): Promise<ItemEntity>;

  getMany(
    userId: number,
    paging: PagingInterface,
    sorting: SortingInterface,
  ): Promise<[ItemEntity[], number]>;

  deleteOne(userId: number, uuid: string): Promise<true>;
}

@Injectable()
export class ItemService implements ItemServiceInterface {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}

  async create(userId: number, body: CreateItemDTO): Promise<ItemEntity> {
    const item = this.itemRepository.create({
      ...body,
      userId,
      uuid: GenerateUUID(16),
    });
    return await this.itemRepository.save(item);
  }

  async update(
    userId: number,
    itemId: string,
    body: UpdateItemDTO,
  ): Promise<ItemEntity> {
    const result = await this.itemRepository.update(
      { uuid: itemId, userId },
      omit(body, 'uuid'),
    );
    if (result.affected > 0) {
      return this.getOne(userId, itemId);
    } else {
      throw new BadRequestException('Unknown id');
    }
  }

  async getOne(userId: number, uuid: string): Promise<ItemEntity> {
    return await this.itemRepository
      .createQueryBuilder('item')
      .where({ uuid, userId })
      .getOne();
  }

  async getMany(
    userId: number,
    { offset, limit }: PagingInterface,
    { sort, sortOrder }: SortingInterface,
  ): Promise<[ItemEntity[], number]> {
    return await this.itemRepository
      .createQueryBuilder('item')
      .where({ userId })
      .orderBy(`item."${sort}"`, sortOrder)
      .offset(offset)
      .limit(limit)
      .getManyAndCount();
  }

  async deleteOne(userId: number, uuid: string): Promise<true> {
    const result = await this.itemRepository.delete({ userId, uuid });
    if (result.affected > 0) {
      return true;
    } else {
      throw new BadRequestException('Unknown id');
    }
  }
}
