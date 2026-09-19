# Live Polling System - Complete Setup Guide

A modern, premium live polling web application built with React, Vite, Tailwind CSS, Go, and MongoDB.

## 🎯 Overview

This project is a full-stack polling application with:
- **Frontend**: Modern React UI with Tailwind CSS and Framer Motion animations
- **Backend**: Go REST API with JWT authentication
- **Database**: MongoDB for data persistence
- **Authentication**: JWT-based secure authentication

## 📋 Prerequisites

- **Node.js** 16.x or higher
- **Go** 1.27.1 or higher
- **MongoDB** 5.0 or higher (Local or MongoDB Atlas)
- **npm** or **yarn** for package management

## 🚀 Quick Start

### 1. Clone and Navigate

```bash
cd live-polling-tool
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
# No additional env file needed, backend proxy is configured in vite.config.js

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Go dependencies
go mod download
go mod tidy

# Create .env file
# Linux/Mac:
cp .env.example .env
# Or create manually with:
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=polling_db
JWT_SECRET=your-super-secret-key-change-in-production
PORT=8080
GIN_MODE=debug
EOF

# Start the backend
go run main.go
```

The backend will run on `http://localhost:8080`

### 4. MongoDB Setup

#### Option A: Local MongoDB

```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Docker (easiest)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Windows
# Download from mongodb.com and follow installation
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com](https://mongodb.com)
2. Create a free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
   ```

## 📁 Project Structure

```
live-polling-tool/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # Auth context
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.css
│
├── backend/
│   ├── models/              # Data models
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── config/              # Configuration
│   ├── utils/               # Utilities
│   ├── main.go
│   └── go.mod
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Polls (Public)
- `GET /api/polls` - Get all polls
- `GET /api/polls/:id` - Get single poll

### Polls (Protected - Requires JWT)
- `POST /api/polls` - Create poll
- `GET /api/polls/user/my-polls` - Get user's polls
- `POST /api/polls/:id/vote` - Vote on poll
- `DELETE /api/polls/:id` - Delete poll

## 🎨 Frontend Features

- **Home Page**: Landing page with features showcase
- **Sign Up/Login**: User authentication with validation
- **Dashboard**: Overview of polls and statistics
- **Create Poll**: Create new polls with emoji support
- **Poll Details**: Vote on polls and see results
- **My Polls**: Manage created polls
- **Responsive Design**: Works on all devices
- **Animations**: Smooth transitions with Framer Motion
- **Dark Theme**: Modern premium dark interface

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- Axios
- React Router DOM

### Backend
- Go 1.27.1
- Gin Web Framework
- MongoDB Driver
- JWT (golang-jwt)
- Bcrypt for password hashing
- CORS middleware

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend validates credentials and hashes password (bcrypt)
3. JWT token is generated (valid for 7 days)
4. Token stored in localStorage
5. Token included in all protected requests
6. Middleware validates token on backend

## 🎯 Key Features

### Create Polls
- Add poll question and description
- Up to 6 options per poll
- Emoji selector for each option
- Validation before submission

### Vote on Polls
- See live poll results
- View percentage and vote counts
- Animated progress bars
- Can't vote twice on same poll

### Dashboard
- Statistics (total polls, active polls, votes)
- Recent polls list
- Quick poll creation
- Animated stat cards

### User Management
- User registration with validation
- Secure login
- Profile display
- Logout functionality

## 📊 Database Schema

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  created_at: Date,
  updated_at: Date
}
```

### Polls
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  question: String,
  description: String,
  options: [
    { text: String, emoji: String, votes: Number }
  ],
  status: String (active/closed),
  created_at: Date
}
```

## 🚀 Build for Production

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
go build -o polling-backend
./polling-backend
```

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Ensure backend is running on port 8080
- Check vite.config.js proxy settings
- Verify CORS is enabled

### MongoDB connection error
- Ensure MongoDB is running locally or connection string is correct
- Check `.env` file MONGODB_URI
- Verify database name is correct

### JWT token issues
- Update `.env` JWT_SECRET to same value in both places
- Check token expiration time
- Verify Authorization header format: "Bearer <token>"

### Port already in use
```bash
# Change port in .env for backend
PORT=8081

# For frontend, Vite will auto-select different port
```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=polling_db
JWT_SECRET=your-super-secret-key
PORT=8080
GIN_MODE=debug
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Go Language](https://golang.org)
- [Gin Framework](https://gin-gonic.com)
- [MongoDB](https://www.mongodb.com)

## 📄 Project Requirements Met

✅ Modern UI with glassmorphism and gradients
✅ Smooth animations with Framer Motion
✅ Responsive design (mobile, tablet, desktop)
✅ JWT authentication
✅ Poll creation and management
✅ Real-time voting and results
✅ Emoji support for poll options
✅ Dashboard with statistics
✅ User profile and authentication
✅ Dark theme premium look
✅ Professional architecture
✅ Complete API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit pull request

## 📄 License

MIT License - feel free to use this project

## 🎉 Enjoy!

This is a premium, production-ready polling application. Happy polling!

---

**Built with ❤️ for GUVI**
