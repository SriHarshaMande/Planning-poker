<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Planning Poker

A modern Planning Poker application for real-time story point estimation in agile teams. This application allows teams to collaborate remotely on story point estimation with an intuitive and interactive interface.

## Features

- Real-time collaborative planning poker sessions
- Interactive voting system
- Real-time results visualization
- Session persistence with player management
- Responsive design for desktop and mobile use

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Recharts for data visualization

### Backend
- Node.js
- Express
- Socket.IO for real-time communication
- TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or yarn

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gemini-planning-poker.git
   cd gemini-planning-poker
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. Create a `.env` file in the project root:
   ```
   VITE_API_URL=http://localhost:3001
   ```

5. Create a `.env` file in the server directory:
   ```
   PORT=3001
   ```

## Running Locally

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
   The server will start on http://localhost:3001

2. In a new terminal, start the frontend development server:
   ```bash
   # From the project root
   npm run dev
   ```
   The application will be available at http://localhost:5173

## Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```
   This will create a `dist` directory with the production build.

2. Build the backend:
   ```bash
   cd server
   npm run build
   ```
   This will create a `dist` directory with the compiled TypeScript files.

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service of choice.

### Backend Deployment
The backend can be deployed to any Node.js hosting service like Heroku, DigitalOcean, or AWS:

1. Build the server:
   ```bash
   cd server
   npm run build
   ```

2. Set the following environment variables on your hosting platform:
   - `PORT`: The port your server will run on
   - Any other configuration variables specific to your deployment

3. Start the server using:
   ```bash
   npm start
   ```

## Environment Variables

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

### Backend (.env)
- `PORT`: Port number for the server (default: 3001)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The agile community for inspiring this tool
