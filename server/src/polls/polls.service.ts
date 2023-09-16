import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddNominationType,
  AddParticipantType,
  CreatePollType,
  JoinPollType,
  RejoinPollType,
  SubmitRangkingType,
} from './type/polls.type';
import {
  createPollId,
  createUserId,
  createNominationId,
} from 'src/utils/ids.util';
import { PollsRepository } from './polls.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtUtil } from 'src/utils/jwt.util';
import { Poll } from 'shared';

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

  async addParticipant(data: AddParticipantType) {
    return this.pollsRepository.addParticipant(data);
  }

  async removeParticipant(
    pollId: string,
    userId: string,
  ): Promise<Poll | void> {
    const poll = await this.pollsRepository.getPoll(pollId);

    if (!poll.hasStarted) {
      const updatedPoll = await this.pollsRepository.removeParticipant(
        pollId,
        userId,
      );

      return updatedPoll;
    }
  }

  async getPoll(pollId: string): Promise<Poll> {
    return this.pollsRepository.getPoll(pollId);
  }

  async addNomination({
    pollId,
    userId,
    text,
  }: AddNominationType): Promise<Poll> {
    return this.pollsRepository.addNomination({
      pollId,
      nominationId: createNominationId(),
      nomination: { userId, text },
    });
  }

  async removeNomination(pollId: string, nominationId: string): Promise<Poll> {
    return this.pollsRepository.removeNomination(pollId, nominationId);
  }

  async startPoll(pollId: string): Promise<Poll> {
    return this.pollsRepository.startPoll(pollId);
  }

  async addParticipantRankings({
    pollId,
    userId,
    rankings,
  }: SubmitRangkingType): Promise<Poll> {
    const hasPollStarted = await this.pollsRepository.getPoll(pollId);

    if (!hasPollStarted.hasStarted) {
      throw new BadRequestException(
        "Participant can't ranked untul poll has started",
      );
    }

    return this.pollsRepository.addParticipantRankings({
      pollId,
      userId,
      rankings,
    });
  }
}
