import React, { useState } from 'react';
import { Player } from '../types';
import AddPlayerModal from './modals/AddPlayerModal';

interface ParticipantsPanelProps {
  players: Player[];
  votesRevealed: boolean;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (playerId: string) => void;
  isModerator: boolean;
}

const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({ players, votesRevealed, onAddPlayer, onRemovePlayer, isModerator }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-dark-surface rounded-xl shadow-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-dark-text-primary">Participants ({players.length})</h3>
      <div className="space-y-3">
        {players.map(player => (
          <div key={player.id} className="flex items-center justify-between bg-dark-bg p-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-dark-text-primary">{player.name}</span>
              {player.isModerator && <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">Mod</span>}
            </div>
            <div className="flex items-center gap-2">
                {isModerator && !player.isModerator && (
                    <button
                        onClick={() => { if (window.confirm(`Are you sure you want to remove ${player.name}?`)) onRemovePlayer(player.id); }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full"
                        title={`Remove ${player.name}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-lg transition-all duration-300
                  ${votesRevealed ? 'bg-brand-primary' : (player.hasVoted ? 'bg-brand-secondary' : 'bg-dark-border')}
                `}>
                  {votesRevealed ? player.vote : (player.hasVoted ? '✓' : '')}
                </div>
            </div>
          </div>
        ))}
      </div>
      {isModerator && (
          <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors">
              Add Player
          </button>
      )}
      {isModalOpen && <AddPlayerModal onClose={() => setIsModalOpen(false)} onAddPlayer={onAddPlayer} />}
    </div>
  );
};

export default ParticipantsPanel;