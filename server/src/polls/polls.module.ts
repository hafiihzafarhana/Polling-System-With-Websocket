import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { ConfigModule } from '@nestjs/config';
import { redisModule } from 'src/redis/redis.config';
import { PollsRepository } from './polls.repository';
import { jwtModule } from 'src/jwt/jwt.config';

@Module({
  imports: [ConfigModule, redisModule, jwtModule],
  providers: [PollsService, PollsRepository],
  controllers: [PollsController],
})
export class PollsModule {}
