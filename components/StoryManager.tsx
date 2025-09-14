
import React, { useState } from 'react';
import { Story } from '../types';
import AiGenerateModal from './modals/AiGenerateModal';

interface StoryManagerProps {
    stories: Story[];
    currentStoryId: string | null;
    onSelectStory: (storyId: string) => void;
    onAddStory: (title: string) => void;
    onAiGenerate: (prompt: string) => Promise<void>;
    isAiLoading: boolean;
    isModerator: boolean;
}

const StoryManager: React.FC<StoryManagerProps> = ({ stories, currentStoryId, onSelectStory, onAddStory, onAiGenerate, isAiLoading, isModerator }) => {
    const [newStoryTitle, setNewStoryTitle] = useState('');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const handleAddStory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStoryTitle.trim()) {
            onAddStory(newStoryTitle.trim());
            setNewStoryTitle('');
        }
    };

    return (
        <div className="bg-dark-surface rounded-xl shadow-lg p-4 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4 text-dark-text-primary">Stories</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                {stories.map(story => (
                    <div
                        key={story.id}
                        onClick={() => onSelectStory(story.id)}
                        className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${story.id === currentStoryId ? 'bg-brand-primary text-white' : 'bg-dark-bg hover:bg-dark-border'}`}
                    >
                        {story.title}
                    </div>
                ))}
            </div>
            {isModerator && (
                <div className="mt-4 pt-4 border-t border-dark-border">
                    <form onSubmit={handleAddStory} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newStoryTitle}
                            onChange={(e) => setNewStoryTitle(e.target.value)}
                            placeholder="Add new story"
                            className="flex-grow bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-colors">+</button>
                    </form>
                    <button onClick={() => setIsAiModalOpen(true)} className="w-full bg-brand-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
                        {isAiLoading ? (
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : '✨ Generate with AI'}
                    </button>
                </div>
            )}
            {isAiModalOpen && <AiGenerateModal onClose={() => setIsAiModalOpen(false)} onGenerate={onAiGenerate} isLoading={isAiLoading} />}
        </div>
    );
};

export default StoryManager;
