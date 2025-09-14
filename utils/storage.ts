import { GameState } from "../types";

// This file has been updated to interact with a backend API.
// The previous localStorage implementation only worked for a single user/browser.
// To enable true multi-user functionality, you must create a backend service
// (e.g., using n8n webhooks) that implements the following API endpoints.

// --- REQUIRED BACKEND API ENDPOINTS ---
//
// 1. Create Game
//    - Endpoint: POST /api/games
//    - Body: { "moderatorName": "John Doe" }
//    - Success Response (200): The full initial GameState object.
//
// 2. Get Game State
//    - Endpoint: GET /api/games/:roomId
//    - Success Response (200): The current GameState object for that room.
//    - Error Response (404): If the room does not exist.
//
// 3. Update Game State
//    - Endpoint: PUT /api/games/:roomId
//    - Body: The complete, updated GameState object.
//    - Success Response (200): The updated GameState object as confirmed by the server.
//
// 4. Join Game
//    - Endpoint: POST /api/games/:roomId/join
//    - Body: { "playerName": "Jane Doe" }
//    - Success Response (200): { "gameState": GameState, "playerId": "new-player-id" }
//    - Error Response (404): Room not found.
//    - Error Response (409): Player name is already taken.
//
// 5. Remove Player
//    - Endpoint: DELETE /api/games/:roomId/players/:playerId
//    - Success Response (200): The updated GameState object.
//
// ---

// Get the API URL from environment variables or use the default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getGame = async (roomId: string): Promise<GameState | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/games/${roomId}`);
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (e) {
        console.error("Failed to fetch game from API", e);
        return null;
    }
};

export const createGame = async (moderatorName: string, roomIdLength?: number): Promise<GameState> => {
    const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moderatorName, roomIdLength }),
    });
    if (!response.ok) throw new Error('Failed to create game via API');
    return response.json();
};


export const joinGame = async (playerName: string, roomId: string): Promise<{ gameState: GameState, playerId: string }> => {
    const response = await fetch(`${API_BASE_URL}/games/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to join game' }));
        throw new Error(error.message);
    }

    return response.json();
};

export const updateGame = async (gameState: GameState): Promise<GameState> => {
    const response = await fetch(`${API_BASE_URL}/games/${gameState.roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameState),
    });
    if (!response.ok) throw new Error('Failed to update game via API');
    return response.json();
};

export const removePlayerFromGame = async (roomId: string, playerId: string): Promise<GameState> => {
    const response = await fetch(`${API_BASE_URL}/games/${roomId}/players/${playerId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove player via API');
    return response.json();
}


// Session Management (sessionStorage is fine as it's client-specific)
const SESSION_ROOM_KEY = 'planning_poker_room';
const SESSION_PLAYER_KEY = 'planning_poker_player';

export const saveSession = (roomId: string, playerId: string) => {
    sessionStorage.setItem(SESSION_ROOM_KEY, roomId);
    sessionStorage.setItem(SESSION_PLAYER_KEY, playerId);
};

export const getSession = (): { roomId: string | null, playerId: string | null } => {
    return {
        roomId: sessionStorage.getItem(SESSION_ROOM_KEY),
        playerId: sessionStorage.getItem(SESSION_PLAYER_KEY),
    };
};

export const clearSession = () => {
    sessionStorage.removeItem(SESSION_ROOM_KEY);
    sessionStorage.removeItem(SESSION_PLAYER_KEY);
};