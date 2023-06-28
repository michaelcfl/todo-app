import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO): Promise<UserModel> {
    const user = await this.userService.create(body);
    return UserModel.fromEntity(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserModel> {
    const user = await this.userService.getOne(id);
    if (!user) {
      throw new BadRequestException('Unknown id');
    }
    return UserModel.fromEntity(user);
  }
}
