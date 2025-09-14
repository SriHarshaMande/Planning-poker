
import React, { useState } from 'react';

interface AddPlayerModalProps {
    onClose: () => void;
    onAddPlayer: (name: string) => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ onClose, onAddPlayer }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddPlayer(name.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-dark-surface p-6 rounded-lg shadow-xl w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-semibold mb-4 text-dark-text-primary">Add New Player</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Player Name"
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                        autoFocus
                    />
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-indigo-500 transition">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlayerModal;
