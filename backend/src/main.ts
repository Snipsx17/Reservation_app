import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.setGlobalPrefix('api/v1');

  const PORT = app.get(ConfigService).get('PORT');
  const ENV = app.get(ConfigService).get('NODE_ENV');
  await app.listen(PORT ?? 4000);

  if (ENV === 'development') console.log(`Server started at port: ${PORT}`);
}

bootstrap();
