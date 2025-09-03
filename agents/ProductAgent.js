const axios = require('axios');

class ProductAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.agentName = 'Product Specialist';
        this.specialty = 'Product information, specifications, features, and recommendations';
    }

    async getProductInfo(userQuery, conversationHistory = []) {
        if (!this.apiKey) {
            throw new Error('Deepseek API key not configured for Product Agent.');
        }

        const systemPrompt = `You are a knowledgeable Product Specialist for Instalily, an appliance parts and service company.

Your expertise includes:
- Product specifications and features
- Product comparisons and recommendations
- Compatibility information
- Product availability and pricing
- Technical specifications
- Installation requirements
- Product warranties and support

Guidelines:
- Provide detailed, accurate product information
- Help customers find the right products for their needs
- Explain technical specifications in simple terms
- Suggest compatible accessories or related products
- Be helpful and informative about product features
- If you don't know specific pricing or availability, direct them to contact sales

Always maintain a professional, helpful tone and provide comprehensive product guidance.`;

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
            console.error('Product Agent API Error:', error.response?.data || error.message);
            throw new Error('Failed to get product information. Please try again.');
        }
    }
}

module.exports = ProductAgent;
