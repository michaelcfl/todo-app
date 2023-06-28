import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import omit from 'lodash/omit';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateUUID } from '../../utils';

interface UserServiceInterface {
  create(body: CreateUserDTO): Promise<UserEntity>;

  update(body: UpdateUserDTO): Promise<UserEntity>;

  getOne(uuid: string): Promise<UserEntity>;
}

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(body: CreateUserDTO): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...body,
      uuid: GenerateUUID(16),
    });
    return await this.userRepository.save(user);
  }

  async update(body: UpdateUserDTO): Promise<UserEntity> {
    const result = await this.userRepository.update(
      { uuid: body.uuid },
      omit(body, 'uuid'),
    );
    if (result.affected > 0) {
      return this.getOne(body.uuid);
    } else {
      throw new Error('Failed to update');
    }
  }

  async getOne(uuid: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where({ uuid })
      .getOne();
  }
}
