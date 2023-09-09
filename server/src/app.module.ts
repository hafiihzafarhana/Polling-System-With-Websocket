import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsModule } from './polls/polls.module';
import { ValidationPipe } from './utils/validationPipe.util';
import { APP_PIPE } from '@nestjs/core';
import { jwtModule } from 'src/jwt/jwt.config';

@Module({
  imports: [ConfigModule.forRoot(), jwtModule, PollsModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
