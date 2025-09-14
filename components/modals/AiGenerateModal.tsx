
import React, { useState } from 'react';

interface AiGenerateModalProps {
    onClose: () => void;
    onGenerate: (prompt: string) => Promise<void>;
    isLoading: boolean;
}

const AiGenerateModal: React.FC<AiGenerateModalProps> = ({ onClose, onGenerate, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            await onGenerate(prompt.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-dark-surface p-6 rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-semibold mb-4 text-dark-text-primary flex items-center gap-2">
                    ✨ Generate Stories with AI
                </h3>
                <p className="text-dark-text-secondary mb-4 text-sm">Describe a feature, and Gemini will generate user stories for you. For example, "A user profile page" or "Shopping cart checkout process".</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a feature description..."
                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                        autoFocus
                    />
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-emerald-500 transition flex items-center justify-center w-28 disabled:opacity-50 disabled:cursor-wait" disabled={isLoading}>
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Generate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AiGenerateModal;
