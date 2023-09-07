import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

// digunakan untuk memberikan cors origin pada gateway secara dinamis
export class DynamicSocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(DynamicSocketIoAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app); // memanggil class constructor dari IoAdapter / kelas yang mewarisi DynamicSocketIoAdapter
  }

  createIOServer(port: number, options?: ServerOptions) {
    const portClient = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${portClient}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${portClient}$/`),
      ],
    };

    this.logger.log('Configure socket Adapter', cors);

    const optionWithCors: ServerOptions = {
      ...options,
      cors,
    };

    return super.createIOServer(port, optionWithCors);
  }
}
