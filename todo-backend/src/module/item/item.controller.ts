import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateItemDTO, UpdateItemDTO } from './item.dto';
import { ItemService } from './item.service';
import { SimpleAuthGuard } from '../../guard/simple-auth.guard';
import { User } from '../../decorator/user.decorator';
import { UserEntity } from '../user/user.entity';
import { ItemModel } from './item.model';
import { Paging, Sort } from '../../decorator/paging.decorator';
import {
  PagingInterface,
  SortingInterface,
} from '../../interface/paging.interface';

@UseGuards(SimpleAuthGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async createItem(@User() user: UserEntity, @Body() body: CreateItemDTO) {
    const item = await this.itemService.create(user.id, body);
    return ItemModel.fromEntity(item);
  }

  @Put(':id')
  async updateItem(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() body: UpdateItemDTO,
  ) {
    const item = await this.itemService.update(user.id, id, body);
    return ItemModel.fromEntity(item);
  }

  @Get()
  async getItems(
    @User() user: UserEntity,
    @Paging() paging: PagingInterface,
    @Sort() sorting: SortingInterface,
  ) {
    const result = await this.itemService.getMany(user.id, paging, sorting);
    return {
      data: result[0].map((item) => ItemModel.fromEntity(item)),
      total: result[1],
    };
  }

  @Get(':id')
  async getItem(@User() user: UserEntity, @Param('id') id: string) {
    const item = await this.itemService.getOne(user.id, id);
    if (!item) {
      throw new BadRequestException('Unknown id');
    }
    return ItemModel.fromEntity(item);
  }

  @Delete(':id')
  async deleteItem(@User() user: UserEntity, @Param('id') id: string) {
    await this.itemService.deleteOne(user.id, id);
    return true;
  }
}
