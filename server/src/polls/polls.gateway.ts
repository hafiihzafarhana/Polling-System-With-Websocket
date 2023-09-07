import { Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { PollsService } from './polls.service';
import { IoAdapter } from '@nestjs/platform-socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'polls',
})
export class PollsGateway implements OnGatewayInit {
  private readonly logger = new Logger(PollsGateway.name);
  constructor(private readonly pollsService: PollsService) {}

  //initialize Gateway
  afterInit(server: any) {
    this.logger.log('Gateway Initialize');
  }
}
