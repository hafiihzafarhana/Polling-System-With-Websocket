import { DynamicModule, Module } from '@nestjs/common';
import ioredis from 'ioredis';
import { RedisAsyncModuleOption } from './type/redis.type';

export const ioredis_key = 'IORedis';

@Module({})
export class RedisModule {
  static async registerAsyncModule({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOption): Promise<DynamicModule> {
    const redisProvider = {
      provide: ioredis_key,
      useFactory: async (...args) => {
        try {
          const { connectionOptions, onClientReady } = await useFactory(
            ...args,
          );

          const client = new ioredis(connectionOptions);

          onClientReady(client);

          return client;
        } catch (error) {
          throw new Error(`Failed to create Redis client: ${error.message}`);
        }
      },
      inject, // akan mencerminkan parameter dari redis.config.ts pada bagian inject yang akan diimplementasikan sebagai parameter dari useFactory
    };

    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
