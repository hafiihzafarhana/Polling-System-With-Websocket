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
