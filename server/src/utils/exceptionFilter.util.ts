import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import {
  WsBadRequestException,
  WsTypeException,
  WsUnknownException,
} from 'src/exceptions/ws-exception';
import { SocketWithAuth } from 'src/type/auth.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const socket: SocketWithAuth = host.switchToWs().getClient();
    console.log('Kemari 1');
    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();

      const wsException = new WsBadRequestException(
        exceptionData['message'] ?? exceptionData ?? exception.name,
      );

      socket.emit('exception', wsException.getError());
      return;
    }
    console.log('Kemari 2');
    if (exception instanceof WsTypeException) {
      socket.emit('exception', exception.getError());
      return;
    }
    console.log('Kemari 3');
    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
    console.log('Kemari 4');
  }
}
