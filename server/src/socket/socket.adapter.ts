import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NextFunction } from 'express';
import { ServerOptions, Server } from 'socket.io';
import { SocketWithAuth } from 'src/type/auth.type';

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

    const jwtService = this.app.get(JwtService); // dapatkan instance JwtService

    const server: Server = super.createIOServer(port, optionWithCors); // mengatur option untuk cors

    // lakukan check dengan middleware pada namespace polls yang apabila ada koneksi akan berjalan atau masuk
    // akan selalu menunggu adanya koneksi karena sudah pasti koneksi untuk client ke server selalu terbuka
    server.of('polls').use(createTokenMiddleware(jwtService, this.logger));

    return server; // jika berhasil akan masuk ke polls.gateway
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next: NextFunction) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(
      `Validating auth token before connection with token: ${token}`,
    );

    try {
      const payload = jwtService.verify(token);
      socket.userId = payload.sub;
      socket.pollId = payload.pollId;
      socket.name = payload.name;
      next();
    } catch (error) {
      next(new Error('FORBIDDEN'));
    }
  };
