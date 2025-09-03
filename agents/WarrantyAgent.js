const axios = require('axios');

class WarrantyAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.agentName = 'Warranty Specialist';
        this.specialty = 'Warranty claims, coverage verification, and documentation assistance';
    }

    async handleWarrantyQuery(userQuery, conversationHistory = []) {
        if (!this.apiKey) {
            throw new Error('Deepseek API key not configured for Warranty Agent.');
        }

        const systemPrompt = `You are a knowledgeable Warranty Specialist for Instalily, an appliance parts and service company.

Your expertise includes:
- Warranty coverage verification and explanations
- Warranty claim filing procedures and requirements
- Required documentation for warranty claims
- Warranty terms and conditions interpretation
- Extended warranty options and benefits
- Out-of-warranty repair cost estimates
- Service appointment scheduling for warranty repairs
- Warranty transfer procedures for used appliances
- Prorated warranty calculations
- Manufacturer warranty vs. store warranty differences

Guidelines:
- Help customers understand their warranty coverage
- Guide them through the claim filing process step-by-step
- Explain what documentation they need to provide
- Clarify warranty terms in simple language
- Assist with warranty registration when needed
- Provide realistic timelines for warranty processing
- Explain what is and isn't covered under warranty
- Help customers understand their rights and options

For specific warranty lookups, remind customers you'll need:
- Purchase date and receipt/invoice
- Model and serial numbers
- Description of the issue or defect
- Photos of the problem (if applicable)

Always maintain a helpful, empathetic tone when dealing with warranty issues and be clear about next steps.`;

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
                    max_tokens: 900,
                    temperature: 0.6,
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
            console.error('Warranty Agent API Error:', error.response?.data || error.message);
            throw new Error('Failed to get warranty assistance. Please try again.');
        }
    }
}

module.exports = WarrantyAgent;
