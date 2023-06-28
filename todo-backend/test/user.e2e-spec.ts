import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { initAppAndDatabase } from './helpers/app';
import { createUser } from './helpers/factories';

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

  describe('(POST) /users', () => {
    const runSingleTest = (variables: any) =>
      request(app.getHttpServer()).post('/users').send(variables);

    it('Able to create user', async () => {
      const result = await runSingleTest({ name: 'Valid Name' });
      expect(result.status).toBe(201);
      expect(result.body.data.id).not.toBeNull();
      expect(result.body.data.name).toBe('Valid Name');
    });

    it('Should throw when name is not provided', async () => {
      const result = await runSingleTest({});
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual(['name must be a string']);
    });
  });

  describe('(GET) /users', () => {
    const runSingleTest = (id: string) =>
      request(app.getHttpServer()).get(`/users/${id}`);

    it('Able to get user', async () => {
      const user = await createUser(dataSource);
      const result = await runSingleTest(user.uuid);
      expect(result.status).toBe(200);
      expect(result.body.data.id).toBe(user.uuid);
      expect(result.body.data.name).toBe(user.name);
    });

    it('throw when unknown id', async () => {
      const result = await runSingleTest('random');
      expect(result.status).toBe(400);
      expect(result.body.message).toEqual('Unknown id');
    });
  });
});
