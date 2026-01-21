import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';
import { RedisIoAdapter } from './websocket/redis-io.adapter';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  })
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter)
  const port = env.PORT
  console.log('App starting on port', port)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
