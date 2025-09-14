
import React, { useState } from 'react';

interface HomeScreenProps {
    onCreateGame: (moderatorName: string) => void;
    // Fix: Update onJoinGame to return a Promise to match the async function in App.tsx.
    onJoinGame: (playerName: string, roomId: string) => Promise<{ success: boolean, message?: string }>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateGame, onJoinGame }) => {
    const [moderatorName, setModeratorName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [joinError, setJoinError] = useState<string | null>(null);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (moderatorName.trim()) {
            onCreateGame(moderatorName.trim());
        }
    };

    // Fix: Make handleJoinSubmit async and await the result of onJoinGame.
    const handleJoinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError(null);
        if (playerName.trim() && roomId.trim()) {
            const result = await onJoinGame(playerName.trim(), roomId.trim());
            if (!result.success) {
                setJoinError(result.message || 'Failed to join the room.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
             <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.5a1 1 0 012 0v5.071a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    <h1 className="text-4xl font-bold text-dark-text-primary">Planning Poker</h1>
                </div>
                <p className="text-dark-text-secondary max-w-2xl">
                    Collaborate with your team to estimate tasks efficiently. Create a room as a moderator or join an existing session to start voting.
                </p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Game Card */}
                <div className="bg-dark-surface p-8 rounded-xl shadow-2xl animate-reveal">
                    <h2 className="text-2xl font-bold text-center mb-6 text-dark-text-primary">Create a New Room</h2>
                    <form onSubmit={handleCreateSubmit}>
                        <label htmlFor="moderatorName" className="block text-sm font-medium text-dark-text-secondary mb-2">
                            Enter your name (you'll be the moderator)
                        </label>
                        <input
                            id="moderatorName"
                            type="text"
                            value={moderatorName}
                            onChange={(e) => setModeratorName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            required
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-indigo-500 transition-colors duration-200 shadow-lg"
                        >
                            Create Room
                        </button>
                    </form>
                </div>
                
                {/* Join Game Card */}
                <div className="bg-dark-surface p-8 rounded-xl shadow-2xl animate-reveal" style={{animationDelay: '100ms'}}>
                    <h2 className="text-2xl font-bold text-center mb-6 text-dark-text-primary">Join an Existing Room</h2>
                    <form onSubmit={handleJoinSubmit}>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="playerName" className="block text-sm font-medium text-dark-text-secondary mb-2">
                                    Your Name
                                </label>
                                <input
                                    id="playerName"
                                    type="text"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="roomId" className="block text-sm font-medium text-dark-text-secondary mb-2">
                                    Room Code
                                </label>
                                <input
                                    id="roomId"
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    placeholder="Enter room code"
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    required
                                />
                            </div>
                        </div>
                        {joinError && <p className="text-red-400 text-sm mt-4 text-center">{joinError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-emerald-500 transition-colors duration-200 shadow-lg"
                        >
                            Join Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
