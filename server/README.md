# Server MVC Architecture

This directory contains the backend server built with Express.js following the Model-View-Controller (MVC) pattern.

## Structure

```
server/
├── app.js              # Main application entry point
├── config/            
│   └── database.js     # Database configuration
├── controllers/        
│   ├── AuthController.js    # Authentication logic
│   ├── ChatController.js    # Chat functionality
│   └── TestController.js    # API testing
├── middleware/         
│   └── auth.js         # JWT authentication middleware
├── models/            
│   └── User.js         # User and ChatHistory models
├── routes/            
│   ├── authRoutes.js   # Authentication endpoints
│   ├── chatRoutes.js   # Chat endpoints
│   └── testRoutes.js   # Test endpoints
├── services/          
│   ├── AuthService.js  # Authentication business logic
│   └── ChatService.js  # Chat and AI agent business logic
└── README.md          # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Chat
- `POST /api/chat` - Send message to AI agents
- `GET /api/chat/history` - Get chat history
- `POST /api/recommend` - Get part recommendations
- `POST /api/troubleshoot` - Get troubleshooting help

### Testing
- `GET /api/test` - API health check

## Features

- **JWT Authentication**: Secure token-based authentication
- **AI Agent Routing**: Intelligent message classification and routing
- **MongoDB Integration**: User management and chat history storage
- **MVC Pattern**: Clean separation of concerns
- **Error Handling**: Centralized error handling middleware
