
const axios = require('axios');

class RecommendationAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async recommendParts(userQuery, context = []) {
        const systemPrompt = `You are a recommendation agent for PartSelect, an e-commerce site for appliance parts. Your job is to recommend refrigerator and dishwasher parts based on user queries and chat context.

Best practices:
- Always mention specific part numbers and their names when available
- If you don't know the answer, say so and ask for more details
- Never make up part numbers or features
- Keep answers concise, friendly, and professional
- Only answer questions about refrigerators, dishwashers, and their parts

Sample Q&A:

User: Which water inlet valve should I buy for my Whirlpool fridge?
Assistant: For most Whirlpool refrigerators, part number PS11752778 (Water Inlet Valve) is commonly used. Please confirm your fridge model for compatibility.

User: Can you recommend a dishwasher rack for Maytag MDB4949SKZ?
Assistant: For the Maytag MDB4949SKZ dishwasher, part number PS12345678 (Lower Dishrack Assembly) is recommended. Please verify with your user manual or contact support for confirmation.

User: What is the best car to buy?
Assistant: I can only assist with refrigerator and dishwasher parts. If you have questions about those, I'm happy to help!

Context: ${context.join('\n')}
User: ${userQuery}`;
        try {
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userQuery }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Deepseek recommendation error:', error);
            return 'Sorry, I could not generate a recommendation at this time.';
        }
    }
}

module.exports = RecommendationAgent;
