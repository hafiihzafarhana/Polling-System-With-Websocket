import { Nomination, Results } from 'shared/poll-types';

// service type...
export type CreatePollType = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollType = {
  pollId: string;
  name: string;
};

export type RejoinPollType = {
  pollId: string;
  userId: string;
  name: string;
};

export type AddParticipantType = {
  pollId: string;
  userId: string;
  name: string;
};

export type AddNominationType = {
  pollId: string;
  userId: string;
  text: string;
};

export type SubmitRangkingType = {
  pollId: string;
  userId: string;
  rankings: string[];
};

// repository type...
export type CreatePollData = {
  pollId: string;
  topic: string;
  votesPerVoter: number;
  userId: string;
};

export type AddParticipantData = {
  pollId: string;
  userId: string;
  name: string;
};

export type AddNominationData = {
  pollId: string;
  nominationId: string;
  nomination: Nomination;
};

export type AddParticipantRankingData = {
  pollId: string;
  userId: string;
  rankings: string[]; // array akan berisi id nominations
};

export type AddResultData = {
  pollId: string;
  results: Results;
};
