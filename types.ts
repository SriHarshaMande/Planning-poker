
export type CardValue = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '20' | '40' | '100' | '?' | '☕';

export interface Player {
  id: string;
  name: string;
  isModerator: boolean;
  vote: CardValue | null;
  hasVoted: boolean;
}

export interface Story {
  id: string;
  title: string;
  estimate: number | null;
}

export interface GameState {
  roomId: string;
  players: Player[];
  stories: Story[];
  currentStoryId: string | null;
  votesRevealed: boolean;
}
