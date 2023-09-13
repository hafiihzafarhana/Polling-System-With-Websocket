import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from './utils/validationPipe.util';
import { DynamicSocketIoAdapter } from './socket/socket.adapter';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const portClient = parseInt(configService.get('CLIENT_PORT'));
  const port = parseInt(configService.get('PORT'));

  app.enableCors({
    origin: [
      `http://localhost:${portClient}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${portClient}$/`),
    ],
  });
  app.useWebSocketAdapter(new DynamicSocketIoAdapter(app, configService));

  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
