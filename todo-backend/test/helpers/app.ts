import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { TransformInterceptor } from '../../src/interceptor/response.interceptor';
import { UserModule } from '../../src/module/user/user.module';
import { ItemModule } from '../../src/module/item/item.module';

export const initAppAndDatabase = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, UserModule, ItemModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  await applyAllSettings(app);
  const dataSource = app.get(getDataSourceToken());
  await app.init();
  return { app, dataSource };
};

export const applyAllSettings = async (app: INestApplication) => {
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
};
