import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, Story, CardValue } from './types';
import { generateStories } from './services/geminiService';
import * as api from './utils/storage';

import HomeScreen from './screens/HomeScreen';
import RoomScreen from './screens/RoomScreen';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const pollingRef = useRef<number | null>(null);

    // This effect loads the user's session from sessionStorage on initial load.
    // It now fetches the game state from the backend API.
    useEffect(() => {
        const restoreSession = async () => {
            const session = api.getSession();
            if (session.roomId && session.playerId) {
                const game = await api.getGame(session.roomId);
                if (game && game.players.some(p => p.id === session.playerId)) {
                    setGameState(game);
                    setCurrentPlayerId(session.playerId);
                } else {
                    // If game or player is not found, the session is invalid.
                    api.clearSession();
                }
            }
        };
        restoreSession();
    }, []);

    // This effect polls the backend for game state changes when a user is in a room.
    useEffect(() => {
        const poll = async () => {
            if (!gameState || !document.hasFocus()) return; // Don't poll if not in a game or tab is not active

            try {
                const updatedGame = await api.getGame(gameState.roomId);

                if (updatedGame && JSON.stringify(updatedGame) !== JSON.stringify(gameState)) {
                    // Check if the current player was removed from the game
                    if (!updatedGame.players.some(p => p.id === currentPlayerId)) {
                        console.log("You have been removed from the game.");
                        api.clearSession();
                        setGameState(null);
                        setCurrentPlayerId(null);
                    } else {
                        setGameState(updatedGame);
                    }
                } else if (!updatedGame) {
                    console.log("The room no longer exists.");
                    api.clearSession();
                    setGameState(null);
                    setCurrentPlayerId(null);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        // Clear any existing timer before setting a new one
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
        }

        if (gameState) {
            pollingRef.current = window.setInterval(poll, 3000); // Poll every 3 seconds
        }

        // Cleanup function to clear the interval when the component unmounts or gameState changes
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [gameState, currentPlayerId]);


    const handleCreateGame = async (moderatorName: string) => {
        try {
            const initialState = await api.createGame(moderatorName);
            const moderator = initialState.players.find(p => p.isModerator);
            if (moderator) {
                api.saveSession(initialState.roomId, moderator.id);
                setGameState(initialState);
                setCurrentPlayerId(moderator.id);
            }
        } catch (error) {
            alert('Error creating game. Please try again.');
            console.error(error);
        }
    };

    const handleJoinGame = async (playerName: string, roomId: string): Promise<{ success: boolean, message?: string }> => {
        try {
            const { gameState: gameToJoin, playerId } = await api.joinGame(playerName, roomId);
            api.saveSession(roomId, playerId);
            setGameState(gameToJoin);
            setCurrentPlayerId(playerId);
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message || 'Failed to join room.' };
        }
    };
    
    const handlePlayerSelect = (playerId: string) => {
        setCurrentPlayerId(playerId);
        if (gameState) {
            api.saveSession(gameState.roomId, playerId);
        }
    };

    const addPlayer = async (name: string) => {
        if (!gameState) return;
        if (gameState.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            alert(`Player "${name}" already exists in this room.`);
            return;
        }
        const newPlayer: Player = { id: `player-${Date.now()}`, name, isModerator: false, vote: null, hasVoted: false };
        const newState: GameState = { ...gameState, players: [...gameState.players, newPlayer] };
        
        try {
            const updatedGame = await api.updateGame(newState);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to add player:", error);
            alert("Could not add player. Please try again.");
        }
    };
    
    const removePlayer = async (playerId: string) => {
        if (!gameState) return;
        try {
            const updatedGame = await api.removePlayerFromGame(gameState.roomId, playerId);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to remove player:", error);
            alert("Could not remove player. Please try again.");
        }
    };

    const addStory = async (title: string) => {
        if (!gameState) return;
        const newStory: Story = { id: `story-${Date.now()}`, title, estimate: null };
        const newStories = [...gameState.stories, newStory];
        const newCurrentStoryId = gameState.currentStoryId === null ? newStory.id : gameState.currentStoryId;
        const newState: GameState = { ...gameState, stories: newStories, currentStoryId: newCurrentStoryId };
        
        try {
            const updatedGame = await api.updateGame(newState);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to add story:", error);
        }
    };

    const handleAiGenerateStories = async (prompt: string) => {
        if (!gameState) return;
        setIsAiLoading(true);
        try {
            const stories = await generateStories(prompt);
            const newStories: Story[] = stories.map((s, i) => ({ id: `story-${Date.now()}-${i}`, title: s.title, estimate: null }));
            const allStories = [...gameState.stories, ...newStories];
            const newCurrentStoryId = gameState.currentStoryId === null ? (allStories[0]?.id || null) : gameState.currentStoryId;
            const newState: GameState = { ...gameState, stories: allStories, currentStoryId: newCurrentStoryId };
            
            const updatedGame = await api.updateGame(newState);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to generate stories:", error);
            alert("An error occurred while generating stories. Please check the console.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const selectStory = async (storyId: string) => {
        if (!gameState) return;
        const newState: GameState = { 
            ...gameState, 
            currentStoryId: storyId, 
            votesRevealed: false, 
            players: gameState.players.map(p => ({ ...p, vote: null, hasVoted: false })) 
        };
        try {
            const updatedGame = await api.updateGame(newState);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to select story:", error);
        }
    };

    const handleVote = async (vote: CardValue) => {
        if (!currentPlayerId || !gameState) return;
        const newState: GameState = {
            ...gameState,
            players: gameState.players.map(p => p.id === currentPlayerId ? { ...p, vote, hasVoted: true } : p)
        };
        try {
            const updatedGame = await api.updateGame(newState);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to submit vote:", error);
        }
    };

    const toggleVotes = async () => {
        if (!gameState) return;
        const newState: GameState = { ...gameState, votesRevealed: !gameState.votesRevealed };
         try {
            const updatedGame = await api.updateGame(newState);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to toggle votes:", error);
        }
    };

    const startNewRound = async () => {
        if (!gameState) return;
        const newState: GameState = { 
            ...gameState, 
            votesRevealed: false, 
            players: gameState.players.map(p => ({ ...p, vote: null, hasVoted: false })) 
        };
         try {
            const updatedGame = await api.updateGame(newState);
            setGameState(updatedGame);
        } catch (error) {
            console.error("Failed to start new round:", error);
        }
    };


    if (!gameState || !currentPlayerId) {
        return <HomeScreen onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />;
    }

    return (
        <RoomScreen
            gameState={gameState}
            currentPlayerId={currentPlayerId}
            onPlayerSelect={handlePlayerSelect}
            isAiLoading={isAiLoading}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onAddStory={addStory}
            onAiGenerateStories={handleAiGenerateStories}
            onSelectStory={selectStory}
            onVote={handleVote}
            onToggleVotes={toggleVotes}
            onStartNewRound={startNewRound}
        />
    );
};

export default App;