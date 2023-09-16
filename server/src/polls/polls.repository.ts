import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ioredis_key } from 'src/redis/redis.module';
import { Redis } from 'ioredis';
import { Poll } from 'shared';
import {
  AddNominationData,
  AddParticipantData,
  CreatePollData,
} from './type/polls.type';

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(ioredis_key) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION');
  }

  async createPoll({
    pollId,
    topic,
    votesPerVoter,
    userId,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      id: pollId,
      topic,
      votesPerVoter,
      participants: {},
      adminId: userId,
      hasStarted: false,
      nominations: {},
    };
    console.log(initialPoll);
    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    // redis key
    const key = `polls:${pollId}`;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)], // JSON.SET merupakan command, adanya "." agar data ditaruh di root sesuai dengan key nya
          ['expire', key, this.ttl], // memberikan waktu
        ])
        .exec();
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with: ${pollID}`);

    const key = `polls:${pollID}`;
    try {
      const pollJSON = await this.redisClient.call('JSON.GET', key, '.');

      if (!pollJSON) throw new NotFoundException();

      const currentPoll: Poll = JSON.parse(pollJSON as string);

      this.logger.verbose(currentPoll);

      // if (currentPoll?.hasStarted) {
      //   throw new BadRequestException('The pol l has already started');
      // }

      return currentPoll;
    } catch (e) {
      this.logger.error(`Failed to get pollID ${pollID}`);
      throw new InternalServerErrorException(e);
    }
  }

  async addParticipant({
    pollId,
    userId,
    name,
  }: AddParticipantData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userID/name: ${userId}/${name} to pollID: ${pollId}`,
    );

    const key = `polls:${pollId}`;
    const participantPath = `.participants.${userId}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      return this.getPoll(pollId);
    } catch (e) {
      this.logger.error(
        `Failed to add a participant with userID/name: ${userId}/${name} to pollID: ${pollId}`,
      );
      throw new InternalServerErrorException(e);
    }
  }

  async removeParticipant(pollId: string, userId: string): Promise<Poll> {
    this.logger.log(`removing user id: ${userId} from poll: ${pollId}`);
    const key = `polls:${pollId}`;
    const participantPath = `.participants.${userId}`;

    try {
      await this.redisClient.call('JSON.DEL', key, participantPath);

      return this.getPoll(pollId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  async addNomination({
    pollId,
    nominationId,
    nomination,
  }: AddNominationData): Promise<Poll> {
    const key = `polls:${pollId}`;
    const nominationPath = `.nominations.${nominationId}`;
    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        nominationPath,
        JSON.stringify(nomination),
      );
      console.log(pollId, nominationId, nomination);
      return this.getPoll(pollId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to add nomination');
    }
  }

  async removeNomination(pollId: string, nominationId: string): Promise<Poll> {
    const key = `polls:${pollId}`;
    const nominationPath = `.nominations.${nominationId}`;
    try {
      await this.redisClient.call('JSON.DEL', key, nominationPath);
      return this.getPoll(pollId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove nomination');
    }
  }
}
