const axios = require('axios');
require('dotenv').config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

async function testCategoryClassification() {
    console.log('🧠 Testing Intelligent Category Classification with Deepseek\n');
    
    const testMessages = [
        "My refrigerator is not cooling properly",
        "I need help with my dishwasher drainage issue", 
        "How can I pay for my order?",
        "What water filter do I need for my Whirlpool fridge?",
        "My dishwasher won't start after I press the button",
        "I was charged twice for my recent purchase",
        "Do you have ice maker parts for Samsung refrigerators?",
        "The dishes are still dirty after running the dishwasher cycle",
        "Can I get a refund for the part I ordered?",
        "My fridge is making strange noises"
    ];

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
            return ['refrigerator', 'dishwasher', 'payment'].includes(category) ? category : 'refrigerator';
        } catch (error) {
            console.error('Classification error:', error.message);
            return 'refrigerator';
        }
    }

    console.log('📋 Testing messages and their classifications:\n');
    
    for (let i = 0; i < testMessages.length; i++) {
        const message = testMessages[i];
        console.log(`${i + 1}. "${message}"`);
        
        try {
            const category = await classifyCategory(message);
            
            let agent = '';
            let emoji = '';
            switch(category) {
                case 'refrigerator':
                    agent = 'Refrigerator Agent (RecommendationAgent)';
                    emoji = '🧊';
                    break;
                case 'dishwasher':
                    agent = 'Dishwasher Agent (TroubleshootingAgent)';
                    emoji = '🍽️';
                    break;
                case 'payment':
                    agent = 'Payment Agent (PaymentAgent)';
                    emoji = '💳';
                    break;
            }
            
            console.log(`   → Category: ${category}`);
            console.log(`   → Routed to: ${emoji} ${agent}\n`);
        } catch (error) {
            console.log(`   → Error: ${error.message}\n`);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ Classification testing completed!');
    console.log('\n🎯 Benefits of AI-Powered Classification:');
    console.log('• More accurate than keyword matching');
    console.log('• Understands context and intent'); 
    console.log('• Handles complex or ambiguous queries');
    console.log('• Routes to specialized agents automatically');
    console.log('• Improves customer experience');
}

if (DEEPSEEK_API_KEY) {
    testCategoryClassification().catch(console.error);
} else {
    console.log('❌ Please set DEEPSEEK_API_KEY in your .env file to run this test');
}
