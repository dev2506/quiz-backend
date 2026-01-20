import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT
  console.log('App starting on port', port)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
