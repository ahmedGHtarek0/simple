# Redis Auth Project

A simple full-stack Authentication system built with React.js, Node.js (Express), and Redis.

## Features
- **Signup**: Create a new account with a unique username.
- **Login**: Secure authentication using JWT and password hashing (bcrypt).
- **Profile**: Protected route to view user information.
- **Modern UI**: Clean, premium design with glassmorphism and smooth animations.

## Tech Stack
- **Frontend**: React (Vite), Axios, React Router, Lucide Icons.
- **Backend**: Node.js, Express, Redis.
- **Database**: Redis (Cloud hosted).
- **Security**: JWT, bcryptjs.

## Getting Started

### Prerequisites
- Node.js installed.
- Access to the Redis Cloud instance (credentials already configured in `server/config/redis.js`).

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available on the port provided by Vite (usually [http://localhost:5173](http://localhost:5173)).

## Configuration
- Redis connection settings are located in `server/config/redis.js`.
- JWT secret and Port are in `server/.env`.
