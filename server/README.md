# Server Architecture

This server follows the MVC (Model-View-Controller) architecture pattern for better organization and maintainability.

## Directory Structure

```
server/
├── app.js                 # Main application entry point
├── config/
│   └── database.js        # Database configuration
├── controllers/
│   ├── AuthController.js  # Authentication logic
│   ├── ChatController.js  # Chat functionality
│   └── TestController.js  # Test endpoints
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   └── User.js           # User and ChatHistory models
├── routes/
│   ├── authRoutes.js     # Authentication routes
│   ├── chatRoutes.js     # Chat routes
│   └── testRoutes.js     # Test routes
├── services/
│   ├── AuthService.js    # Authentication business logic
│   └── ChatService.js    # Chat business logic
└── agents/
    ├── ChatAgent.js      # General chat AI agent
    ├── ProfileAgent.js   # User profile management
    ├── RecommendationAgent.js # Product recommendations
    └── TroubleshootingAgent.js # Technical support
```

## Architecture Overview

### Controllers
Handle HTTP requests and responses. They validate input, call services, and return appropriate responses.

### Services  
Contain business logic and orchestrate interactions between different components. Services call agents and models.

### Models
Handle data persistence and database interactions. Define schemas and provide database access methods.

### Routes
Define API endpoints and associate them with controller methods. Include middleware for authentication.

### Middleware
Handle cross-cutting concerns like authentication, logging, and error handling.

### Agents
Specialized AI agents that handle different types of user interactions:
- **ChatAgent**: General conversations
- **RecommendationAgent**: Product recommendations
- **TroubleshootingAgent**: Technical support
- **ProfileAgent**: User profile and chat history management

## Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Code is organized and easier to modify
3. **Testability**: Individual components can be tested in isolation
4. **Scalability**: Easy to add new features and endpoints
5. **Reusability**: Services and models can be reused across different controllers

## Usage

Start the server:
```bash
npm run server
```

The server will run on http://localhost:3001
