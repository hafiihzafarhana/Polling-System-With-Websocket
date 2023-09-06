import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { Request } from 'express';

type AuthPayload = {
  userId: string;
  pollId: string;
  name: string;
};

export type RequestWithAuth = Request & AuthPayload;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Invalid Authorization Request');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);

      request.userId = payload.sub;
      request.pollId = payload.pollId;
      request.name = payload.name;

      return request;
    } catch (error) {
      throw new ForbiddenException('Invalid Authorization Request');
    }
  }
}
