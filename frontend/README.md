# Tetris Frontend

React-based frontend for the Tetris game, built with Vite.

## Features

- Real-time gameplay via WebSocket
- Responsive UI with beautiful gradient design
- Keyboard controls
- Score tracking and next piece preview

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and set your backend WebSocket URL:

```
VITE_WS_URL=ws://localhost:3000
```

Start the development server:

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Deployment to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow the prompts to configure your deployment

4. Set environment variable in Vercel dashboard:
   - `VITE_WS_URL`: Your backend WebSocket URL (e.g., `wss://your-backend.onrender.com`)

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Set the root directory to `frontend`
6. Add environment variable:
   - Name: `VITE_WS_URL`
   - Value: Your backend WebSocket URL (e.g., `wss://your-backend.onrender.com`)
7. Click "Deploy"

### Method 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/contactevin2u/Tetris-App-Testing&root-directory=frontend&env=VITE_WS_URL&envDescription=WebSocket%20URL%20for%20the%20backend%20server)

## Environment Variables

- `VITE_WS_URL`: WebSocket URL for connecting to the backend server
  - Local development: `ws://localhost:3000`
  - Production: `wss://your-backend.onrender.com`

## Controls

- **Arrow Left/Right**: Move piece horizontally
- **Arrow Down**: Soft drop (move piece down faster)
- **Arrow Up or Space**: Rotate piece
- **Enter**: Hard drop (instantly drop piece to bottom)
- **P**: Pause/Resume game

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── GameBoard.jsx       # Main game canvas
│   │   ├── GameControls.jsx    # Control buttons
│   │   ├── GameOverModal.jsx   # Game over overlay
│   │   ├── InfoPanel.jsx       # Score and info display
│   │   ├── NextPiece.jsx       # Next piece preview
│   │   └── StatusIndicator.jsx # Connection status
│   ├── hooks/
│   │   └── useWebSocket.js     # WebSocket connection hook
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── vercel.json                 # Vercel configuration
├── .env.example                # Environment variables template
└── package.json
```

## Technologies

- React 19
- Vite
- WebSocket API
- HTML5 Canvas

## License

ISC
