
import React, { useState } from 'react';

interface CreateGameModalProps {
    onCreate: (moderatorName: string) => void;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({ onCreate }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-dark-surface p-8 rounded-xl shadow-2xl w-full max-w-md m-4">
                <h2 className="text-2xl font-bold text-center mb-6 text-dark-text-primary">Welcome to Planning Poker</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="moderatorName" className="block text-sm font-medium text-dark-text-secondary mb-2">
                        Enter your name to start a new game
                    </label>
                    <input
                        id="moderatorName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name (Moderator)"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-indigo-500 transition-colors duration-200 shadow-lg"
                    >
                        Create Game
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGameModal;
