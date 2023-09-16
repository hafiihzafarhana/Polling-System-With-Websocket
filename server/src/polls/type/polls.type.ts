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

// repository type...
export interface CreatePollData {
  pollId: string;
  topic: string;
  votesPerVoter: number;
  userId: string;
}

export interface AddParticipantData {
  pollId: string;
  userId: string;
  name: string;
}

export interface RemoveParticipantData {
  pollId: string;
  userId: string;
}
