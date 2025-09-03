const ChatAgent = require('../../agents/ChatAgent');
const ProfileAgent = require('../../agents/ProfileAgent');
const RecommendationAgent = require('../../agents/RecommendationAgent');
const TroubleshootingAgent = require('../../agents/TroubleshootingAgent');
const PaymentAgent = require('../../agents/PaymentAgent');
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const chatAgent = new ChatAgent(DEEPSEEK_API_KEY);
const profileAgent = new ProfileAgent();
const recommendationAgent = new RecommendationAgent(DEEPSEEK_API_KEY);
const troubleshootingAgent = new TroubleshootingAgent(DEEPSEEK_API_KEY);
const paymentAgent = new PaymentAgent(DEEPSEEK_API_KEY);

class ChatService {
    static async classifyCategory(message) {
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

    static async processChat(message, username) {
        if (!DEEPSEEK_API_KEY) {
            throw new Error('Deepseek API key not configured.');
        }

        try {
            const contextMessages = await profileAgent.getChatHistory(username);
            const category = await this.classifyCategory(message);
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

            return { response: assistantMessage, category };
        } catch (error) {
            console.error('Error in agentic chat:', error);
            throw new Error('Failed to get response from AI assistant.');
        }
    }

    static async getChatHistory(username) {
        try {
            const history = await profileAgent.getChatHistory(username);
            return history;
        } catch (error) {
            console.error('Error retrieving chat history:', error);
            throw new Error('Failed to retrieve chat history.');
        }
    }

    static async getRecommendation(message, username) {
        try {
            const contextMessages = await profileAgent.getChatHistory(username);
            const recommendation = await recommendationAgent.recommendParts(
                message, 
                contextMessages.map(m => m.content)
            );
            return { recommendation };
        } catch (error) {
            console.error('Error in recommendation agent:', error);
            throw new Error('Failed to get recommendation.');
        }
    }

    static async getTroubleshooting(message, username) {
        try {
            const contextMessages = await profileAgent.getChatHistory(username);
            const troubleshooting = await troubleshootingAgent.troubleshootIssue(
                message, 
                contextMessages.map(m => m.content)
            );
            return { troubleshooting };
        } catch (error) {
            console.error('Error in troubleshooting agent:', error);
            throw new Error('Failed to get troubleshooting advice.');
        }
    }

    static async clearChatHistory(username) {
        try {
            await profileAgent.clearChatHistory(username);
            return { message: 'Chat history cleared successfully' };
        } catch (error) {
            console.error('Error clearing chat history:', error);
            throw new Error('Failed to clear chat history.');
        }
    }
}

module.exports = ChatService;
