const axios = require('axios');

class PaymentAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async handlePaymentQuery(userQuery, context = []) {
        const systemPrompt = `You are a payment and billing support agent for PartSelect, an e-commerce site for appliance parts. Your job is to help customers with payment, billing, order, and account-related questions.

Best practices:
- Provide clear, helpful information about billing and payment processes
- Be empathetic and professional when handling payment issues
- Guide customers through payment procedures step-by-step
- For complex issues, suggest contacting customer support
- Only answer questions about payments, billing, orders, shipping, and account issues

Sample Q&A:

User: How can I pay for my order?
Assistant: We accept several payment methods: credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. You can select your preferred payment method during checkout.

User: I was charged twice for my order
Assistant: I understand your concern about being charged twice. This could be a duplicate authorization that will be automatically released. Please check your account in 1-2 business days. If the duplicate charge persists, please contact our customer support team with your order number for immediate assistance.

User: Can I get a refund for my part?
Assistant: Yes, we offer refunds within 30 days of purchase for unused parts in original packaging. To process a refund, please contact our customer support with your order number and reason for return.

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
            console.error('Deepseek payment agent error:', error);
            return 'Sorry, I could not process your payment inquiry at this time. Please contact our customer support team for assistance.';
        }
    }
}

module.exports = PaymentAgent;
