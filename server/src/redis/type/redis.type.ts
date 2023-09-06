import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

type RedisModuleOption = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

export type RedisAsyncModuleOption = {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOption> | RedisModuleOption;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

// Pada RedisAsyncModuleOption
// Sebenarnya berbentuk seperti ini
// {
//     imports:[], => Menggunakan Pick karena akan menggunakan ModuleMetadata
//     useFactory:[], => berbentuk seperti fucntion karena di dalamnya ada inisialisasi
//     inject:[] => menggunakan Pick karena akan menggunakan FactoryProvider
// }
