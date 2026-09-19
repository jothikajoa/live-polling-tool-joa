# Live Polling Tool - Backend

A modern, premium polling application backend built with Go, Gin, and MongoDB.

## Features

- User authentication with JWT
- Create and manage polls
- Real-time voting system  
- Beautiful REST API
- MongoDB integration
- Comprehensive error handling

## Tech Stack

- **Go 1.27.1+**
- **Gin Web Framework** - HTTP framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Project Structure

```
backend/
├── models/          # Data models (User, Poll)
├── controllers/     # Business logic (Auth, Poll handlers)
├── routes/          # API routes
├── middleware/      # Authentication middleware
├── config/          # Configuration (MongoDB setup)
├── utils/           # Utility functions (JWT, Hash)
├── main.go          # Application entry point
└── go.mod          # Dependencies
```

## Installation

### Prerequisites

- Go 1.27.1 or higher
- MongoDB 5.0 or higher

### Setup

1. **Clone the repository**

```bash
cd backend
```

2. **Install dependencies**

```bash
go mod download
```

3. **Configure environment variables**

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=polling_db
JWT_SECRET=your-super-secret-key-change-in-production
PORT=8080
GIN_MODE=debug
```

4. **Start MongoDB**

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local installation
mongod
```

5. **Run the backend**

```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user

### Polls (Public)

- **GET** `/api/polls` - Get all polls
- **GET** `/api/polls/:id` - Get poll by ID

### Polls (Protected)

- **POST** `/api/polls` - Create new poll
- **GET** `/api/polls/user/my-polls` - Get user's polls
- **POST** `/api/polls/:id/vote` - Vote on poll
- **DELETE** `/api/polls/:id` - Delete poll

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Development

### Run in Development Mode

```bash
GIN_MODE=debug go run main.go
```

### Build for Production

```bash
go build -o polling-backend
./polling-backend
```
