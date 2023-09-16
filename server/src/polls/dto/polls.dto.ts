import { IsInt, IsString, Length, Max, Min, IsNotEmpty } from 'class-validator';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  topic: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  votesPerVoter: number;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  name: string;
}

export class JoinPollDto {
  @IsString()
  @Length(6, 6)
  pollId: string;

  @IsString()
  @Length(8, 50)
  name: string;
}

export class RejoinPollDto {
  @IsString()
  @Length(8, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  pollId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class NominationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  text: string;
}
