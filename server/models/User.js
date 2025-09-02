const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    messages: [
        {
            user: {
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
            assistant: {
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
            category: { type: String },
        }
    ]
});

const UserModel = mongoose.model('User', userSchema);

const User = {
    async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existing = await UserModel.findOne({ username });
        if (existing) {
            throw new Error('User already exists');
        }
        const user = new UserModel({ username, password: hashedPassword });
        await user.save();
        return { username };
    },

    async findByUsername(username) {
        return await UserModel.findOne({ username });
    },

    async verifyPassword(storedPassword, providedPassword) {
        return await bcrypt.compare(providedPassword, storedPassword);
    }
};

const ChatHistory = {
    async addMessagePair(username, userContent, assistantContent, category) {
        let userDoc = await UserModel.findOne({ username });
        if (!userDoc) return;
        userDoc.messages.push({
            user: {
                content: userContent,
                timestamp: Date.now(),
            },
            assistant: {
                content: assistantContent,
                timestamp: Date.now(),
            },
            category: category || 'general',
        });
        await userDoc.save();
    },

    async getHistory(username) {
        const userDoc = await UserModel.findOne({ username });
        return userDoc ? userDoc.messages : [];
    }
};

module.exports = { User, ChatHistory };
