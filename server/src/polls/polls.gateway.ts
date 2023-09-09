import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { PollsService } from './polls.service';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/socket/socket.adapter';

@WebSocketGateway({
  namespace: 'polls',
})
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollsGateway.name);
  constructor(private readonly pollsService: PollsService) {}

  @WebSocketServer() io: Namespace;

  //initialize Gateway
  afterInit(server: any) {
    this.logger.log('Gateway Initialize');
  }

  handleConnection(client: SocketWithAuth, ...args: any[]) {
    // client.emit() akan mengirimkan pesan ke seluru client
    // this.io.emit() akan mengirimkan pesan ke seluru client termasuk si pengirim

    const sockets = this.io.sockets;
    this.logger.log(`Data: ${client.name}, ${client.pollId}, ${client.userId}`);
    this.logger.log(`WS Client id:${client.id} connected`);
    this.logger.log(`Number of connected socket is ${sockets.size}`);

    this.io.emit('hello from', 'Hallo');
  }

  handleDisconnect(client: SocketWithAuth) {
    // client.emit() akan mengirimkan pesan ke seluru client
    // this.io.emit() akan mengirimkan pesan ke seluru client termasuk si pengirim

    const sockets = this.io.sockets;
    this.logger.log(`Data: ${client.name}, ${client.pollId}, ${client.userId}`);
    this.logger.log(`WS Client id:${client.id} disconnected`);
    this.logger.log(`Number of disconnected socket is ${sockets.size}`);
  }
}
