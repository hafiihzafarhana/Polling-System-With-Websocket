import { Socket } from 'socket.io';

export type AuthPayload = {
  userId: string;
  pollId: string;
  name: string;
};

export type SocketWithAuth = Socket & AuthPayload;
