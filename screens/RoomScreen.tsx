import React, { useMemo } from 'react';
import { GameState, CardValue } from '../types';
import { VOTING_DECK } from '../constants';
import Header from '../components/Header';
import StoryManager from '../components/StoryManager';
import ParticipantsPanel from '../components/ParticipantsPanel';
import VotingPanel from '../components/VotingPanel';
import ResultsChart from '../components/ResultsChart';

interface RoomScreenProps {
    gameState: GameState;
    currentPlayerId: string;
    isAiLoading: boolean;
    onPlayerSelect: (playerId: string) => void;
    onAddPlayer: (name: string) => void;
    onRemovePlayer: (playerId: string) => void;
    onAddStory: (title: string) => void;
    onAiGenerateStories: (prompt: string) => Promise<void>;
    onSelectStory: (storyId: string) => void;
    onVote: (vote: CardValue) => void;
    onToggleVotes: () => void;
    onStartNewRound: () => void;
}

const RoomScreen: React.FC<RoomScreenProps> = ({
    gameState,
    currentPlayerId,
    isAiLoading,
    onPlayerSelect,
    onAddPlayer,
    onRemovePlayer,
    onAddStory,
    onAiGenerateStories,
    onSelectStory,
    onVote,
    onToggleVotes,
    onStartNewRound,
}) => {
    const currentStory = useMemo(() => gameState.stories.find(s => s.id === gameState.currentStoryId), [gameState]);
    const currentPlayer = useMemo(() => gameState.players.find(p => p.id === currentPlayerId), [gameState, currentPlayerId]);
    const allPlayersVoted = gameState.players.every(p => p.hasVoted);

    if (!currentPlayer) {
        // This case should ideally not happen if logic is correct
        return <div className="flex items-center justify-center h-screen">Error: Current player not found.</div>;
    }

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            <Header roomCode={gameState.roomId} currentPlayerName={currentPlayer.name || ''} players={gameState.players} onPlayerSelect={onPlayerSelect} />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8 p-4 sm:p-6 lg:p-8">
                <aside className="lg:col-span-1 flex flex-col gap-8">
                    <StoryManager
                        stories={gameState.stories}
                        currentStoryId={gameState.currentStoryId}
                        onSelectStory={onSelectStory}
                        onAddStory={onAddStory}
                        onAiGenerate={onAiGenerateStories}
                        isAiLoading={isAiLoading}
                        isModerator={currentPlayer.isModerator || false}
                    />
                    <ParticipantsPanel 
                        players={gameState.players} 
                        votesRevealed={gameState.votesRevealed} 
                        onAddPlayer={onAddPlayer} 
                        isModerator={currentPlayer.isModerator || false}
                        onRemovePlayer={onRemovePlayer}
                    />
                </aside>

                <div className="lg:col-span-3 bg-dark-surface rounded-xl shadow-lg flex flex-col p-6 h-[calc(100vh-150px)]">
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <h2 className="text-dark-text-secondary text-lg mb-2">Currently Voting</h2>
                        <h1 className="text-3xl sm:text-4xl font-bold text-dark-text-primary mb-8 break-words max-w-full">{currentStory?.title || 'No story selected'}</h1>
                        {gameState.votesRevealed ? (
                            <ResultsChart players={gameState.players} />
                        ) : (
                            <div className="flex flex-wrap justify-center gap-4">
                                {gameState.players.map(player => (
                                    <div key={player.id} className="flex flex-col items-center">
                                        <div className={`w-16 h-24 sm:w-20 sm:h-28 rounded-lg flex items-center justify-center transition-all duration-300 ${player.hasVoted ? 'bg-brand-secondary' : 'bg-dark-border'}`}>
                                            {player.hasVoted && <span className="text-3xl text-white">✓</span>}
                                        </div>
                                        <span className="mt-2 text-sm text-dark-text-secondary">{player.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {currentPlayer.isModerator && (
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={onToggleVotes}
                                disabled={!allPlayersVoted && !gameState.votesRevealed}
                                className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                            >
                                {gameState.votesRevealed ? 'Hide Votes' : 'Reveal Votes'}
                            </button>
                            <button
                                onClick={onStartNewRound}
                                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-colors"
                            >
                                New Round
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <VotingPanel
                deck={VOTING_DECK}
                onVote={onVote}
                isRevealed={gameState.votesRevealed}
                votedCard={currentPlayer.vote || null}
            />
        </div>
    );
};

export default RoomScreen;