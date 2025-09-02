const axios = require('axios');

class TroubleshootingAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async troubleshootIssue(userQuery, context = []) {
        const systemPrompt = `You are a troubleshooting agent for PartSelect, an e-commerce site for appliance parts. Your job is to provide step-by-step troubleshooting advice for refrigerators and dishwashers.\n\nBest practices:\n- Always give clear, actionable steps.\n- Ask clarifying questions if needed.\n- Never make up part numbers or solutions.\n- Only answer questions about refrigerators, dishwashers, and their parts.\n- If you don't know, say so and suggest contacting support.\n\nSample Q&A:\n\nUser: My Whirlpool fridge ice maker is not working.\nAssistant: Let's troubleshoot your Whirlpool fridge ice maker.\n1. Check if the water supply line is connected and turned on.\n2. Make sure the freezer temperature is set between 0-5°F (-18 to -15°C).\n3. Inspect the ice maker control arm to ensure it's in the down position.\nIf these steps don't help, please provide more details or contact support.\n\nUser: My Maytag dishwasher won't drain.\nAssistant: For a Maytag dishwasher that won't drain:\n1. Check for clogs in the drain hose.\n2. Inspect the drain pump for debris.\n3. Make sure the filter is clean.\nIf the issue persists, let me know more about the symptoms.\n\nUser: How do I fix my car?\nAssistant: I can only assist with refrigerator and dishwasher parts. If you have questions about those, I'm happy to help!\n\nContext: ${context.join('\n')}\nUser: ${userQuery}`;
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
            console.error('Deepseek troubleshooting error:', error);
            return 'Sorry, I could not generate troubleshooting advice at this time.';
        }
    }
}

module.exports = TroubleshootingAgent;
