require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('./src/models/User');
const mongoose = require('mongoose');
const ChatAgent = require('./agents/ChatAgent');
const ProfileAgent = require('./agents/ProfileAgent');
const RecommendationAgent = require('./agents/RecommendationAgent');
const TroubleshootingAgent = require('./agents/TroubleshootingAgent');
const PaymentAgent = require('./agents/PaymentAgent');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/case-study';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const chatAgent = new ChatAgent(DEEPSEEK_API_KEY);
const profileAgent = new ProfileAgent();
const recommendationAgent = new RecommendationAgent(DEEPSEEK_API_KEY);
const troubleshootingAgent = new TroubleshootingAgent(DEEPSEEK_API_KEY);
const paymentAgent = new PaymentAgent(DEEPSEEK_API_KEY);
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

const systemPrompt = `You are a helpful chat agent for PartSelect, an e-commerce website specializing in appliance parts. The system automatically routes queries to specialized agents:

- **Refrigerator Agent:** Handles refrigerator parts, repairs, recommendations, troubleshooting
- **Dishwasher Agent:** Handles dishwasher parts, repairs, recommendations, troubleshooting  
- **Payment Agent:** Handles billing, payments, refunds, orders, shipping, account issues

Your primary functions are:
1. **Provide Product Information:** Answer questions about parts, including details like price, availability, and specifications.
2. **Assist with Installation:** Provide installation instructions for specific part numbers.
3. **Check Compatibility:** Help users determine if a part is compatible with their appliance model.
4. **Troubleshoot Issues:** Offer guidance on common problems with refrigerators and dishwashers.

**CRITICAL INSTRUCTIONS:**
- **ONLY respond to the current user question** - do not repeat or re-answer previous questions from the conversation history
- **Use conversation history ONLY for context** - to understand what the user is referring to or to avoid repeating information
- **Stay On-Topic:** Only answer questions related to your specialized domain
- **Keep responses concise and focused** - do not provide multiple answers in one response unless specifically asked
- **Use a Professional and Friendly Tone**
- **Format responses using markdown** for better readability (use **bold**, *italic*, ### headers, etc.)

**If asked about non-appliance topics:** "I can only provide assistance with refrigerator and dishwasher parts. If you have any questions about those, I'd be happy to help!"

Remember: You are responding to ONE specific question. Use context from previous messages only to understand the current question better, not to re-answer old questions.`;

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create(username, password);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await User.verifyPassword(user.password, password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



app.post('/api/chat', authenticateToken, async (req, res) => {
    console.log('Received chat request:', req.body);
    console.log('User:', req.user);
    
    const { message } = req.body;
    const { username } = req.user;

    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'Deepseek API key not configured.' });
    }

    async function classifyCategory(message) {
        const classificationPrompt = `You are an expert classification system for a customer support platform. 

Your task is to categorize customer messages into exactly ONE of these categories:

1. "refrigerator" - Messages about refrigerator parts, repairs, troubleshooting, recommendations, ice makers, water filters, cooling issues, etc.
2. "dishwasher" - Messages about dishwasher parts, repairs, troubleshooting, recommendations, cleaning issues, drainage problems, etc.  
3. "payment" - Messages about billing, payments, refunds, pricing, orders, shipping, account issues, etc.

IMPORTANT RULES:
- Respond with ONLY the category name (refrigerator, dishwasher, or payment)
- No explanations, no additional text
- If unsure, choose the most relevant category
- Default to "refrigerator" if the message is unclear but seems appliance-related

Customer message: "${message}"

Category:`;

        try {
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: 'You are a precise categorization system. Respond only with the exact category name.' },
                        { role: 'user', content: classificationPrompt }
                    ],
                    max_tokens: 10,
                    temperature: 0.1
                },
                {
                    headers: {
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const category = response.data.choices[0].message.content.trim().toLowerCase();
            
            if (['refrigerator', 'dishwasher', 'payment'].includes(category)) {
                return category;
            } else {
                return 'refrigerator';
            }
        } catch (error) {
            console.error('Category classification error:', error);
            return 'refrigerator';
        }
    }

    try {
        const contextMessages = await profileAgent.getChatHistory(username);
        const category = await classifyCategory(message);
        let assistantMessage;

        if (category === 'refrigerator') {
            assistantMessage = await recommendationAgent.recommendParts(message, contextMessages.map(m => m.user?.content || ''));
        } else if (category === 'dishwasher') {
            assistantMessage = await troubleshootingAgent.troubleshootIssue(message, contextMessages.map(m => m.user?.content || ''));
        } else if (category === 'payment') {
            assistantMessage = await paymentAgent.handlePaymentQuery(message, contextMessages.map(m => m.user?.content || ''));
        } else {
            assistantMessage = await chatAgent.getResponse(message, contextMessages.map(m => m.user?.content || ''));
        }

        await profileAgent.saveChatMessagePair(username, message, assistantMessage, category);

        res.json({ response: assistantMessage, category });
    } catch (error) {
        console.error('Error in agentic chat:', error);
        res.status(500).json({ error: 'Failed to get response from AI assistant.' });
    }
});

app.post('/api/recommend', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const { username } = req.user;
    try {
        const contextMessages = await profileAgent.getChatHistory(username);
        const recommendation = await recommendationAgent.recommendParts(message, contextMessages.map(m => m.content));
        res.json({ recommendation });
    } catch (error) {
        console.error('Error in recommendation agent:', error);
        res.status(500).json({ error: 'Failed to get recommendation.' });
    }
});

app.post('/api/troubleshoot', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const { username } = req.user;
    try {
        const contextMessages = await profileAgent.getChatHistory(username);
        const troubleshooting = await troubleshootingAgent.troubleshootIssue(message, contextMessages.map(m => m.content));
        res.json({ troubleshooting });
    } catch (error) {
        console.error('Error in troubleshooting agent:', error);
        res.status(500).json({ error: 'Failed to get troubleshooting advice.' });
    }
});

app.get('/api/chat/history', authenticateToken, async (req, res) => {
    try {
        const history = await profileAgent.getChatHistory(req.user.username);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat history.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
