
const axios = require('axios');

class TroubleshootingAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async troubleshootIssue(userQuery, context = []) {
        const systemPrompt = `You are a troubleshooting agent for PartSelect, an e-commerce site for appliance parts. Your job is to provide step-by-step troubleshooting advice for refrigerators and dishwashers.

Best practices:
- Always give clear, actionable steps
- Ask clarifying questions if needed
- Never make up part numbers or solutions
- Only answer questions about refrigerators, dishwashers, and their parts
- If you don't know, say so and suggest contacting support

Sample Q&A:

User: My Whirlpool fridge ice maker is not working.
Assistant: Let's troubleshoot your Whirlpool fridge ice maker.
1. Check if the water supply line is connected and turned on.
2. Make sure the freezer temperature is set between 0-5°F (-18 to -15°C).
3. Inspect the ice maker control arm to ensure it's in the down position.
If these steps don't help, please provide more details or contact support.

User: My Maytag dishwasher won't drain.
Assistant: For a Maytag dishwasher that won't drain:
1. Check for clogs in the drain hose.
2. Inspect the drain pump for debris.
3. Make sure the filter is clean.
If the issue persists, let me know more about the symptoms.

User: How do I fix my car?
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
            console.error('Deepseek troubleshooting error:', error);
            return 'Sorry, I could not generate troubleshooting advice at this time.';
        }
    }
}

module.exports = TroubleshootingAgent;
