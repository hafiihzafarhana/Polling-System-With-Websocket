import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dto/polls.dto';
import { ValidationPipe } from 'src/utils/validationPipe.util';
import { PollsService } from './polls.service';
import { AuthGuard, RequestWithAuth } from 'src/utils/authGuard.util';

@UsePipes(new ValidationPipe())
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  async createPoll(@Body() data: CreatePollDto) {
    return this.pollsService.createPoll(data);
  }

  @Post('join')
  async joinPoll(@Body() data: JoinPollDto) {
    return this.pollsService.joinPoll(data);
  }

  @Post('rejoin')
  @UseGuards(AuthGuard)
  async rejoinPoll(@Req() req: RequestWithAuth) {
    const { userId, pollId, name } = req;
    return this.pollsService.rejoinPoll({
      pollId,
      userId,
      name,
    });
  }
}
