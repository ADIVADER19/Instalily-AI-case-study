# Instalily AI - Intelligent Customer Support Platform

A modern AI-powered customer support platform built with React and Node.js, featuring intelligent message classification and specialized AI agents for different service categories.

## 🚀 Features

### Core Functionality
- **AI-Powered Chat**: Integrated with Deepseek API for intelligent responses
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Intelligent Message Classification**: Automatic categorization of user queries
- **Specialized AI Agents**: Category-specific responses for optimal user experience
- **Chat History Management**: Persistent conversation history with filtering options

### Specialized AI Agents
- **🧊 Refrigerator Agent**: Expert assistance for refrigerator parts, repairs, and troubleshooting
- **🍽️ Dishwasher Agent**: Specialized support for dishwasher issues and maintenance
- **💳 Payment Agent**: Handles billing, payments, refunds, and account-related queries

### User Interface
- **Responsive Design**: Mobile-first approach with modern CSS styling
- **Category Filtering**: Filter chat history by refrigerator, dishwasher, or payment categories
- **Clear History**: Option to clear all chat history with confirmation
- **Real-time Chat**: Interactive chat interface with message formatting
- **Profile Management**: User profile with conversation history and statistics

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for navigation
- **Axios**: HTTP client for API communication
- **SweetAlert2**: Beautiful alert modals for user interactions
- **CSS3**: Custom responsive styling with gradients and animations

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework with MVC architecture
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing for security
- **CORS**: Cross-origin resource sharing
- **Deepseek API**: AI language model integration

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/                   # React frontend source
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── api/              # API communication layer
│   ├── context/          # React context providers
│   └── models/           # Frontend data models
├── server/               # Backend MVC architecture
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Authentication middleware
│   └── config/           # Database configuration
└── agents/               # Specialized AI agents
    ├── ChatAgent.js      # General chat handling
    ├── RecommendationAgent.js # Refrigerator support
    ├── TroubleshootingAgent.js # Dishwasher support
    ├── PaymentAgent.js   # Payment queries
    └── ProfileAgent.js   # User profile management
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Deepseek API key

### Environment Variables
Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/instalily
JWT_SECRET=your_jwt_secret_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ADIVADER19/Instalily-AI-case-study.git
   cd Instalily-AI-case-study
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB** (if running locally)

4. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or run separately
   npm run server  # Backend on http://localhost:3001
   npm start       # Frontend on http://localhost:3000
   ```

## 🖥️ Available Scripts

### Development
- `npm start` - Runs the React frontend in development mode
- `npm run server` - Starts the Node.js backend server
- `npm run dev` - Runs both frontend and backend concurrently

### Testing & Building
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run test-classification` - Tests the AI classification system

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat & History
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get user's chat history
- `DELETE /api/chat/history` - Clear user's chat history

### Specialized Endpoints
- `POST /api/recommend` - Get refrigerator recommendations
- `POST /api/troubleshoot` - Get dishwasher troubleshooting

## 🔮 AI Intelligence Features

### Message Classification
The system automatically classifies user messages into categories:
- **Refrigerator**: Parts, repairs, cooling issues, ice makers, water filters
- **Dishwasher**: Cleaning issues, drainage problems, maintenance
- **Payment**: Billing, refunds, pricing, orders, account issues

### Context-Aware Responses
Each AI agent maintains conversation context and provides specialized knowledge:
- **Recommendation Agent**: Suggests refrigerator parts and solutions
- **Troubleshooting Agent**: Provides step-by-step dishwasher repair guidance
- **Payment Agent**: Handles financial queries and account management

## 📱 User Experience

### Responsive Design
- Mobile-first responsive layout
- Touch-friendly interface
- Optimized for all screen sizes

### Interactive Features
- Real-time chat with typing indicators
- Message formatting (bold, italic, headers)
- Expandable long messages with "Read more" functionality
- Category-based filtering of chat history
- Confirmation dialogs for destructive actions

## 🚀 Deployment

The application is production-ready and can be deployed to:
- **Frontend**: Netlify, Vercel, or any static hosting service
- **Backend**: Heroku, Railway, DigitalOcean, or AWS
- **Database**: MongoDB Atlas for cloud database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Deepseek AI**: For providing the intelligent language model
- **React Team**: For the excellent frontend framework
- **MongoDB**: For the flexible database solution
- **Express.js**: For the robust backend framework

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

Built with ❤️ by [ADIVADER19](https://github.com/ADIVADER19)
