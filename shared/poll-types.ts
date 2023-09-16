export type Participants = {
  [participantId: string]: string;
};

export type Nomination = {
  userId: string;
  text: string;
};

export type Nominations = {
  [nominationId: string]: Nomination;
};

export type Rankings = {
  [userId: string]: string[];
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminId: string;
  nominations: Nominations;
  rankings: Rankings;
  // results: Results;
  hasStarted: boolean;
};
