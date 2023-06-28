import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DEFAULT_LIMIT } from '../interface/paging.interface';

export const Paging = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const offset = request.query['offset'];
    const limit = request.query['limit'];

    return { offset: offset ?? 0, limit: limit ?? DEFAULT_LIMIT };
  },
);

export const Sort = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const sort = request.query['sort'];
    const sortOrder = ['ASC', 'DESC'].includes(
      request.query['sort-order'] as string,
    )
      ? request.query['sort-order']
      : 'DESC';

    return { sort: sort ?? 'createdAt', sortOrder: sortOrder };
  },
);
