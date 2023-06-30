import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { initAppAndDatabase } from './helpers/app';
import { createItem, createUser } from './helpers/factories';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const appData = await initAppAndDatabase();
    app = appData.app;
    dataSource = appData.dataSource;
  });

  afterAll(async () => {
    dataSource.destroy();
  });

  describe('(POST) /items', () => {
    const runSingleTest = (variables: any, userIdHeader?: string) => {
      const query = request(app.getHttpServer()).post('/items').send(variables);
      if (userIdHeader) {
        query.set('current-user', userIdHeader);
      }
      return query;
    };

    it('Able to create Item', async () => {
      const user = await createUser(dataSource);
      const result = await runSingleTest(
        { title: 'Title', description: 'description' },
        user.uuid,
      );
      expect(result.status).toBe(201);
      expect(result.body.data.id).not.toBeNull();
      expect(result.body.data.title).toBe('Title');
      expect(result.body.data.description).toBe('description');
      expect(result.body.data.done).toBe(false);
      expect(result.body.data.createdAt).not.toBeNull;
    });

    it('Should not throw when description is not provided', async () => {
      const user = await createUser(dataSource);
      const result = await runSingleTest({ title: 'title' }, user.uuid);
      expect(result.status).toBe(201);
      expect(result.body.data.id).not.toBeNull();
      expect(result.body.data.title).toBe('title');
      expect(result.body.data.description).toBeNull();
    });

    it('Should throw when title is not provided', async () => {
      const user = await createUser(dataSource);
      const result = await runSingleTest(
        { description: 'description' },
        user.uuid,
      );
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual(['title must be a string']);
    });

    it('Should throw when user header is not provided', async () => {
      const result = await runSingleTest({
        title: 'title',
        description: 'description',
      });
      expect(result.status).toBe(401);
    });
  });

  describe('(GET) /items/:id', () => {
    const runSingleTest = (id: string, userIdHeader?: string) => {
      const query = request(app.getHttpServer()).get(`/items/${id}`).send();
      if (userIdHeader) {
        query.set('current-user', userIdHeader);
      }
      return query;
    };

    it('Able to get item', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const result = await runSingleTest(item.uuid, user.uuid);
      expect(result.status).toBe(200);
      expect(result.body.data.id).toBe(item.uuid);
      expect(result.body.data.title).toBe(item.title);
      expect(result.body.data.description).toBe(item.description);
    });

    it('throw when no user header', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const result = await runSingleTest(item.uuid);
      expect(result.status).toBe(401);
    });

    it('throw when unknown id', async () => {
      const user = await createUser(dataSource);
      const result = await runSingleTest('random', user.uuid);
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual('Unknown id');
    });

    it('throw when userId and item userId not match', async () => {
      const user = await createUser(dataSource);
      const user2 = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const result = await runSingleTest(item.uuid, user2.uuid);
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual('Unknown id');
    });
  });

  describe('(GET) /items', () => {
    const runSingleTest = (
      userIdHeader?: string,
      queryPairs?: { [key: string]: string | number },
    ) => {
      const query = request(app.getHttpServer())
        .get(`/items`)
        .query(queryPairs)
        .send();
      if (userIdHeader) {
        query.set('current-user', userIdHeader);
      }
      return query;
    };

    it('Able to get items', async () => {
      const user = await createUser(dataSource);
      const item1 = await createItem(dataSource, user.id);
      const item2 = await createItem(dataSource, user.id);
      const item3 = await createItem(dataSource, user.id);
      const result = await runSingleTest(user.uuid);
      expect(result.status).toBe(200);
      expect(result.body.data.total).toBe(3);
      expect(result.body.data.data.length).toBe(3);
      // Default sorted by createdAt desc
      expect(result.body.data.data[0].title).toBe(item3.title);
      expect(result.body.data.data[1].title).toBe(item2.title);
      expect(result.body.data.data[2].title).toBe(item1.title);
    });

    it('Able to get items with pagination and sorting', async () => {
      const user = await createUser(dataSource);
      const item1 = await createItem(dataSource, user.id);
      const item2 = await createItem(dataSource, user.id);
      const item3 = await createItem(dataSource, user.id);
      const queries = {
        offset: 0,
        limit: 1,
        sort: 'createdAt',
        ['sort-order']: 'ASC',
      };
      const result = await runSingleTest(user.uuid, queries);
      expect(result.status).toBe(200);
      expect(result.body.data.total).toBe(3);
      expect(result.body.data.data.length).toBe(1);
      expect(result.body.data.data[0].title).toBe(item1.title);

      queries.offset = 1;
      queries.limit = 2;
      const result2 = await runSingleTest(user.uuid, queries);
      expect(result2.status).toBe(200);
      expect(result2.body.data.total).toBe(3);
      expect(result2.body.data.data.length).toBe(2);
      expect(result2.body.data.data[0].title).toBe(item2.title);
      expect(result2.body.data.data[1].title).toBe(item3.title);
    });

    it('Cannot get other user items', async () => {
      const user = await createUser(dataSource);
      await createItem(dataSource, user.id);
      await createItem(dataSource, user.id);
      await createItem(dataSource, user.id);
      const user2 = await createUser(dataSource);
      const result = await runSingleTest(user2.uuid);
      expect(result.status).toBe(200);
      expect(result.body.data.data.length).toEqual(0);
      expect(result.body.data.total).toEqual(0);
    });

    it('throw when no user header', async () => {
      const result = await runSingleTest();
      expect(result.status).toBe(401);
    });
  });

  describe('(PUT) /items/:id', () => {
    const runSingleTest = (id: string, body: any, userIdHeader?: string) => {
      const query = request(app.getHttpServer()).put(`/items/${id}`).send(body);
      if (userIdHeader) {
        query.set('current-user', userIdHeader);
      }
      return query;
    };

    it('Able to update items', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const result = await runSingleTest(
        item.uuid,
        { title: 'New Title', done: true },
        user.uuid,
      );
      expect(result.status).toBe(200);
      expect(result.body.data.id).toBe(item.uuid);
      expect(result.body.data.title).toBe('New Title');
      expect(result.body.data.description).toBe(item.description);
      expect(result.body.data.done).toBe(true);
    });

    it('throw when trying to update others item', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const user2 = await createUser(dataSource);
      const result = await runSingleTest(
        item.uuid,
        { title: 'New Title', done: true },
        user2.uuid,
      );
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual('Unknown id');
    });

    it('throw when trying to update non-exist id', async () => {
      const user = await createUser(dataSource);
      await createItem(dataSource, user.id);
      const result = await runSingleTest(
        'random',
        { title: 'New Title', done: true },
        user.uuid,
      );
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual('Unknown id');
    });

    it('throw when no user header', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const result = await runSingleTest(item.uuid, { done: true });
      expect(result.status).toBe(401);
    });
  });

  describe('(DELETE) /items/:id', () => {
    const runSingleTest = (id: string, userIdHeader?: string) => {
      const query = request(app.getHttpServer()).delete(`/items/${id}`).send();
      if (userIdHeader) {
        query.set('current-user', userIdHeader);
      }
      return query;
    };

    it('Able to delete item', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const result = await runSingleTest(item.uuid, user.uuid);
      expect(result.status).toBe(200);
      expect(result.body.data).toBe(true);
    });

    it('throw when trying to delete non-exist item', async () => {
      const user = await createUser(dataSource);
      await createItem(dataSource, user.id);
      const result = await runSingleTest('random', user.uuid);
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual('Unknown id');
    });

    it('throw when trying to delete others item', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const user2 = await createUser(dataSource);
      const result = await runSingleTest(item.uuid, user2.uuid);
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual('Unknown id');
    });

    it('throw when no user header', async () => {
      const user = await createUser(dataSource);
      const item = await createItem(dataSource, user.id);
      const result = await runSingleTest(item.uuid);
      expect(result.status).toBe(401);
    });
  });
});
