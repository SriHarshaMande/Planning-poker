import { GameState, Player } from '../types';

// In-memory store for active games
const games: Map<string, GameState> = new Map();

// Generate a random room ID
const generateRoomId = (length: number = 6): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const GameService = {
    createGame(moderatorName: string, roomIdLength: number = 6): GameState {
        let roomId: string;
        do {
            roomId = generateRoomId(roomIdLength);
        } while (games.has(roomId));

        const moderatorId = `player-${Date.now()}`;
        const initialState: GameState = {
            roomId,
            players: [{ id: moderatorId, name: moderatorName, isModerator: true, vote: null, hasVoted: false }],
            stories: [],
            currentStoryId: null,
            votesRevealed: false
        };

        games.set(roomId, initialState);
        return initialState;
    },

    getGame(roomId: string): GameState | null {
        return games.get(roomId) || null;
    },

    joinGame(roomId: string, playerName: string): { gameState: GameState; playerId: string } {
        const game = games.get(roomId);
        if (!game) {
            throw new Error('Room not found');
        }

        if (game.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
            throw new Error('Player name already exists in this room');
        }

        const playerId = `player-${Date.now()}`;
        const newPlayer: Player = {
            id: playerId,
            name: playerName,
            isModerator: false,
            vote: null,
            hasVoted: false
        };

        const updatedGame: GameState = {
            ...game,
            players: [...game.players, newPlayer]
        };

        games.set(roomId, updatedGame);
        return { gameState: updatedGame, playerId };
    },

    updateGame(roomId: string, gameState: GameState): GameState {
        if (!games.has(roomId)) {
            throw new Error('Room not found');
        }
        games.set(roomId, gameState);
        return gameState;
    },

    removePlayer(roomId: string, playerId: string): GameState {
        const game = games.get(roomId);
        if (!game) {
            throw new Error('Room not found');
        }

        const updatedGame: GameState = {
            ...game,
            players: game.players.filter(p => p.id !== playerId)
        };

        games.set(roomId, updatedGame);
        return updatedGame;
    },

    deleteGame(roomId: string): void {
        games.delete(roomId);
    }
};
