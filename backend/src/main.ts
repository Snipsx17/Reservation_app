import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const PORT = app.get(ConfigService).get('PORT');
  const ENV = app.get(ConfigService).get('ENV_NODE');
  await app.listen(PORT ?? 4000);
  ENV === 'development' || console.log(`Server started at port: ${PORT}`)
}
bootstrap();
