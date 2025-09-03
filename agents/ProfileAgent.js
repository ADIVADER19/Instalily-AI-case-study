const { User, ChatHistory } = require('../src/models/User');

class ProfileAgent {
    constructor() {}

    async getUserProfile(username) {
        const user = await User.findByUsername(username);
        if (!user) return null;
        return { username: user.username };
    }

    async getChatHistory(username) {
        return await ChatHistory.getHistory(username);
    }

    async saveChatMessagePair(username, userContent, assistantContent, category) {
        await ChatHistory.addMessagePair(username, userContent, assistantContent, category);
    }

    async clearChatHistory(username) {
        return await ChatHistory.clearHistory(username);
    }
}

module.exports = ProfileAgent;
