
import React, { useState } from 'react';
import { Player } from '../types';

interface HeaderProps {
    roomCode: string;
    currentPlayerName: string;
    players: Player[];
    onPlayerSelect: (playerId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ roomCode, currentPlayerName, players, onPlayerSelect }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);
        alert('Room Code copied to clipboard!');
    };
    
    const handleSelect = (playerId: string) => {
        onPlayerSelect(playerId);
        setIsDropdownOpen(false);
    };

    return (
        <header className="bg-dark-surface shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.5a1 1 0 012 0v5.071a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <h1 className="text-xl font-bold text-dark-text-primary">Planning Poker</h1>
                <div className="hidden sm:flex items-center gap-2 bg-dark-bg px-3 py-1 rounded-lg">
                    <span className="text-sm text-dark-text-secondary">Room:</span>
                    <span className="font-mono text-brand-secondary">{roomCode}</span>
                    <button onClick={handleCopy} className="text-dark-text-secondary hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-dark-bg px-4 py-2 rounded-lg hover:bg-dark-border transition">
                     <span className="text-dark-text-primary font-semibold">{currentPlayerName}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-dark-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-surface rounded-md shadow-lg z-10 animate-fade-in">
                        <div className="py-1">
                            {players.map(player => (
                                <a
                                    key={player.id}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleSelect(player.id); }}
                                    className="block px-4 py-2 text-sm text-dark-text-primary hover:bg-dark-border"
                                >
                                    {player.name} {player.isModerator && '(Mod)'}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
