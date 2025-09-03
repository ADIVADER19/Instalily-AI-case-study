const axios = require('axios');

class OrderSupportAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.agentName = 'Order Support Specialist';
        this.specialty = 'Order management, tracking, shipping, and delivery support';
    }

    async handleOrderSupport(userQuery, conversationHistory = []) {
        if (!this.apiKey) {
            throw new Error('Deepseek API key not configured for Order Support Agent.');
        }

        const systemPrompt = `You are a dedicated Order Support Specialist for Instalily, an appliance parts and service company.

Your expertise includes:
- Order tracking and status updates
- Shipping and delivery information
- Order modifications and cancellations
- Return and exchange processes
- Delivery scheduling and coordination
- Package issues and missing items
- Order confirmation and receipt questions
- Shipping address changes

Guidelines:
- Help customers track and manage their orders
- Provide clear information about shipping timelines
- Assist with order modifications when possible
- Guide customers through return/exchange processes
- Be empathetic about delivery delays or issues
- Offer solutions for order-related problems
- Direct complex cases to appropriate departments

For specific order numbers or account details, remind customers that you'll need to verify their information for security.

Always maintain a helpful, solution-oriented approach to resolve order concerns.`;

        const conversationContext = conversationHistory.length > 0 
            ? `\n\nPrevious conversation context:\n${conversationHistory.slice(-3).join('\n')}`
            : '';

        try {
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `${userQuery}${conversationContext}` }
                    ],
                    max_tokens: 800,
                    temperature: 0.7,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Order Support Agent API Error:', error.response?.data || error.message);
            throw new Error('Failed to get order support. Please try again.');
        }
    }
}

module.exports = OrderSupportAgent;
