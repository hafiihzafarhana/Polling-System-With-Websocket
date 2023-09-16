import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PollsService } from 'src/polls/polls.service';
import { SocketWithAuth } from 'src/type/auth.type';
import { WsUnauthorizedException } from 'src/exceptions/ws-exception';
import { AuthPayload } from 'src/type/auth.type';

@Injectable()
export class GatewayAdminGuard implements CanActivate {
  private readonly logger = new Logger(GatewayAdminGuard.name);
  constructor(
    private readonly pollsService: PollsService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: SocketWithAuth = context.switchToWs().getClient();

    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    if (!token) {
      this.logger.error('No authorized token provided');

      throw new WsUnauthorizedException('No authorized token provided');
    }

    try {
      const payload: AuthPayload & { sub: string } =
        this.jwtService.verify(token);
      this.logger.debug(`validating admin using token payload: ${payload}`);

      const { sub, pollId } = payload;

      const poll = await this.pollsService.getPoll(pollId);
      console.log(poll);
      if (sub !== poll.adminId) {
        throw new WsUnauthorizedException('Admin Required');
      }
      return true;
    } catch (error) {
      throw new WsUnauthorizedException('Admin Required');
    }
  }
}
