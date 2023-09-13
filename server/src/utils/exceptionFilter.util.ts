import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import {
  WsBadRequestException,
  WsUnknownException,
} from 'src/exceptions/ws-exception';
import { SocketWithAuth } from 'src/socket/socket.adapter';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const socket: SocketWithAuth = host.switchToWs().getClient();
    console.log(exception instanceof BadRequestException);
    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();

      const wsException = new WsBadRequestException(
        exceptionData['message'] ?? exceptionData ?? exception.name,
      );

      socket.emit('exception', wsException.getError());
      return;
    }
    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException);
  }
}
