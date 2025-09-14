import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { GameService } from './services/gameService';

// Load environment variables
config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/games', (req, res) => {
    try {
        const { moderatorName, roomIdLength } = req.body;
        const game = GameService.createGame(moderatorName, roomIdLength);
        io.emit(`game:${game.roomId}:update`, game);
        res.json(game);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/games/:roomId', (req, res) => {
    try {
        const { roomId } = req.params;
        const game = GameService.getGame(roomId);
        if (!game) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(game);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/games/:roomId/join', (req, res) => {
    try {
        const { roomId } = req.params;
        const { playerName } = req.body;
        const result = GameService.joinGame(roomId, playerName);
        io.emit(`game:${roomId}:update`, result.gameState);
        res.json(result);
    } catch (error: any) {
        if (error.message === 'Room not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Player name already exists in this room') {
            return res.status(409).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
});

app.put('/games/:roomId', (req, res) => {
    try {
        const { roomId } = req.params;
        const gameState = req.body;
        const updatedGame = GameService.updateGame(roomId, gameState);
        io.emit(`game:${roomId}:update`, updatedGame);
        res.json(updatedGame);
    } catch (error: any) {
        if (error.message === 'Room not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
});

app.delete('/games/:roomId/players/:playerId', (req, res) => {
    try {
        const { roomId, playerId } = req.params;
        const updatedGame = GameService.removePlayer(roomId, playerId);
        io.emit(`game:${roomId}:update`, updatedGame);
        res.json(updatedGame);
    } catch (error: any) {
        if (error.message === 'Room not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
});

// WebSocket handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinRoom', (roomId: string) => {
        socket.join(`game:${roomId}`);
    });

    socket.on('leaveRoom', (roomId: string) => {
        socket.leave(`game:${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
