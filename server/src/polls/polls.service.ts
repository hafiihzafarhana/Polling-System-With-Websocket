import { Injectable } from '@nestjs/common';
import {
  CreatePollType,
  JoinPollType,
  RejoinPollType,
} from './type/polls.type';
import { createPollId, createUserId } from 'src/utils/ids.util';
import { PollsRepository } from './polls.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtUtil } from 'src/utils/jwt.util';

@Injectable()
export class PollsService {
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createPoll(data: CreatePollType) {
    const pollId = createPollId();
    const userId = createUserId(); // for admin who have the poll
    const create = await this.pollsRepository.createPoll({
      pollId,
      topic: data.topic,
      votesPerVoter: data.votesPerVoter,
      userId,
    });

    const signedToken = new JwtUtil(this.jwtService).signToken({
      name: data.name,
      pollId: create.id,
      subject: userId,
    });

    return {
      poll: create,
      accessToken: signedToken,
    };
  }

  async joinPoll(data: JoinPollType) {
    const userId = createUserId(); // for people who joined the poll

    const joinedPoll = await this.pollsRepository.getPoll(data.pollId);

    const signedToken = new JwtUtil(this.jwtService).signToken({
      name: data.name,
      pollId: joinedPoll.id,
      subject: userId,
    });

    return {
      poll: joinedPoll,
      accessToken: signedToken,
    };
  }

  async rejoinPoll(data: RejoinPollType) {
    const joinedPoll = await this.pollsRepository.addParticipant(data);

    return joinedPoll;
  }
}
