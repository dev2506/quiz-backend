import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplication } from '@nestjs/common';
import { env } from 'src/config/env';

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>

    constructor(app: INestApplication) {
        super(app);
    }

    async connectToRedis(): Promise<void> {
        const pubClient = createClient({
            url: env.REDIS_URL
        })

        const subClient = pubClient.duplicate()

        await Promise.all([
            pubClient.connect(),
            subClient.connect(),
        ])

        this.adapterConstructor = createAdapter(pubClient, subClient)
    }

    createIOServer(port: number, options?: any) {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
