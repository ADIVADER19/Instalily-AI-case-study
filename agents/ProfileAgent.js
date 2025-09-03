const { User } = require('../server/models/User');

class ProfileAgent {
    constructor() {}

    async getUserProfile(username) {
        const user = await User.findByUsername(username);
        if (!user) return null;
        return { username: user.username };
    }

    async getChatHistory(username) {
        return await User.getChatHistory(username);
    }

    async saveChatMessagePair(username, userContent, assistantContent, category) {
        await User.addMessagePair(username, userContent, assistantContent, category);
    }

    async clearChatHistory(username) {
        return await User.clearChatHistory(username);
    }
}

module.exports = ProfileAgent;
