import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:8080' });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
