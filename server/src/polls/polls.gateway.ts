import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { PollsService } from './polls.service';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/type/auth.type';
import { AllExceptionsFilter } from 'src/utils/exceptionFilter.util';
import { GatewayAdminGuard } from 'src/utils/gatewayAdmin.guard';

@UsePipes(new ValidationPipe())
@UseFilters(new AllExceptionsFilter())
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

  // clients parameter adalah orang atau objek yang terhubung
  async handleConnection(client: SocketWithAuth, ...args: any[]) {
    // client.emit() akan mengirimkan pesan ke seluru client
    // this.io.emit() akan mengirimkan pesan ke seluru client termasuk si pengirim

    // const sockets = this.io.sockets;

    const roomName = client.pollId;

    // bergabungnya user atau client ke room
    await client.join(roomName);

    // jumlah klien terhubung
    // jika tidak ada orang, maka ada return undefined. sehingga perlu ditambah "?" agar menjadi null
    const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.log(`user id: ${client.userId} join the room`);
    this.logger.log(
      `size of member joined room ${roomName}: ${connectedClients}`,
    );
    console.log(client.pollId, client.userId);
    const updatedPoll = await this.pollsService.addParticipant({
      pollId: client.pollId,
      userId: client.userId,
      name: client.name,
    });

    this.io.to(roomName).emit('poll_updated', updatedPoll);
  }

  async handleDisconnect(client: SocketWithAuth) {
    // client.emit() akan mengirimkan pesan ke seluru client
    // this.io.emit() akan mengirimkan pesan ke seluru client termasuk si pengirim

    const sockets = this.io.sockets;

    const updatedPoll = await this.pollsService.removeParticipant(
      client.pollId,
      client.userId,
    );

    const roomName = client.pollId;

    const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.log(`Disconnect socket id: ${client.id}`);
    this.logger.log(`Number of connected socket: ${sockets.size}`);
    this.logger.log(`Number of joined room ${roomName}: ${connectedClients}`);

    // updatedPoll bisa saja undefined jika poll telah dimulai
    if (updatedPoll) {
      this.io.to(client.pollId).emit('poll_updated', updatedPoll);
    }
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_participant')
  async removeParticipant(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.logger.debug(
      `Attempting to remove participant ${id} from poll ${client.pollId}`,
    );

    const updatedPoll = await this.pollsService.removeParticipant(
      client.pollId,
      id,
    );

    if (updatedPoll) {
      this.io.to(client.pollId).emit('poll_updated', updatedPoll);
    }
  }

  @SubscribeMessage('mall2')
  async checkit(@ConnectedSocket() client: SocketWithAuth) {
    this.io.to(client.pollId).emit('mall', 'updatedPoll');
  }
}
