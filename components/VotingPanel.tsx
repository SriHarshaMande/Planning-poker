
import React from 'react';
import { CardValue } from '../types';
import Card from './Card';

interface VotingPanelProps {
  deck: CardValue[];
  onVote: (value: CardValue) => void;
  isRevealed: boolean;
  votedCard: CardValue | null;
}

const VotingPanel: React.FC<VotingPanelProps> = ({ deck, onVote, isRevealed, votedCard }) => {
  return (
    <footer className="sticky bottom-0 bg-dark-surface/80 backdrop-blur-sm p-4 shadow-lg-top">
      <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
        {deck.map(value => (
          <Card
            key={value}
            value={value}
            onClick={onVote}
            isSelected={votedCard === value}
            isRevealed={isRevealed}
          />
        ))}
      </div>
    </footer>
  );
};

export default VotingPanel;
