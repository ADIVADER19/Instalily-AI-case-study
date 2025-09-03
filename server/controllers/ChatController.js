const ChatService = require('../services/ChatService');

class ChatController {
    static async chat(req, res) {
        try {
            const { message } = req.body;
            const { username } = req.user;
            
            const result = await ChatService.processChat(message, username);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getHistory(req, res) {
        try {
            const history = await ChatService.getChatHistory(req.user.username);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async recommend(req, res) {
        try {
            const { message } = req.body;
            const { username } = req.user;
            
            const result = await ChatService.getRecommendation(message, username);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async troubleshoot(req, res) {
        try {
            const { message } = req.body;
            const { username } = req.user;
            
            const result = await ChatService.getTroubleshooting(message, username);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async clearHistory(req, res) {
        try {
            await ChatService.clearChatHistory(req.user.username);
            res.json({ message: 'Chat history cleared successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProductInfo(req, res) {
        try {
            const { message } = req.body;
            const { username } = req.user;
            
            const result = await ChatService.getProductInfo(message, username);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getOrderSupport(req, res) {
        try {
            const { message } = req.body;
            const { username } = req.user;
            
            const result = await ChatService.getOrderSupport(message, username);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getWarrantySupport(req, res) {
        try {
            const { message } = req.body;
            const { username } = req.user;
            
            const result = await ChatService.getWarrantySupport(message, username);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ChatController;
