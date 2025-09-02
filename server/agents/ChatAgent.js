const axios = require('axios');

class ChatAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async getResponse(message, context = []) {
        const prompt = context.length > 0 ? `${context.join('\n')}\nUser: ${message}` : message;
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant for PartSelect.' },
                    { role: 'user', content: prompt }
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
    }
}

module.exports = ChatAgent;
