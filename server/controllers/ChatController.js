const ChatService = require('../services/ChatService');

class ChatController {
    static async chat(req, res) {
        console.log('Received chat request:', req.body);
        console.log('User:', req.user);
        
        const { message } = req.body;
        const { username } = req.user;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const result = await ChatService.processMessage(message, username);
        
        if (result.success) {
            res.json({ 
                response: result.response, 
                category: result.category 
            });
        } else {
            res.status(500).json({ error: result.error });
        }
    }

    static async getChatHistory(req, res) {
        const { username } = req.user;
        
        const result = await ChatService.getChatHistory(username);
        
        if (result.success) {
            res.json(result.history);
        } else {
            res.status(500).json({ error: result.error });
        }
    }

    static async recommend(req, res) {
        const { message } = req.body;
        const { username } = req.user;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const result = await ChatService.getRecommendation(message, username);
        
        if (result.success) {
            res.json({ recommendation: result.recommendation });
        } else {
            res.status(500).json({ error: result.error });
        }
    }

    static async troubleshoot(req, res) {
        const { message } = req.body;
        const { username } = req.user;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const result = await ChatService.getTroubleshooting(message, username);
        
        if (result.success) {
            res.json({ troubleshooting: result.troubleshooting });
        } else {
            res.status(500).json({ error: result.error });
        }
    }
}

module.exports = ChatController;
