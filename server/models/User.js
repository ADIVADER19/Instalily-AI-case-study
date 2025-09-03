const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
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
            category: { type: String, default: 'general' },
        }
    ]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

class User {
    static async create(username, password) {
        try {
            // Check if user already exists
            const existingUser = await mongoose.model('User').findOne({ username });
            if (existingUser) {
                throw new Error('Username already exists');
            }

            const user = new (mongoose.model('User'))({
                username,
                password
            });
            
            const savedUser = await user.save();
            return {
                id: savedUser._id,
                username: savedUser.username,
                createdAt: savedUser.createdAt
            };
        } catch (error) {
            throw error;
        }
    }

    static async findByUsername(username) {
        try {
            const user = await mongoose.model('User').findOne({ username });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async verifyPassword(hashedPassword, password) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const user = await mongoose.model('User').findById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async addMessagePair(username, userContent, assistantContent, category) {
        try {
            const user = await mongoose.model('User').findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            user.messages.push({
                user: {
                    content: userContent,
                    timestamp: new Date(),
                },
                assistant: {
                    content: assistantContent,
                    timestamp: new Date(),
                },
                category: category || 'general',
            });

            await user.save();
            return { success: true };
        } catch (error) {
            console.error('Error adding message pair:', error);
            throw error;
        }
    }

    static async getChatHistory(username) {
        try {
            const user = await mongoose.model('User').findOne({ username });
            return user ? user.messages : [];
        } catch (error) {
            console.error('Error getting chat history:', error);
            throw error;
        }
    }

    static async clearChatHistory(username) {
        try {
            const user = await mongoose.model('User').findOne({ username });
            if (user) {
                user.messages = [];
                await user.save();
            }
            return { message: 'Chat history cleared successfully' };
        } catch (error) {
            console.error('Error clearing chat history:', error);
            throw error;
        }
    }
}

// Create the model (check if already exists to avoid recompilation)
let UserModel;
try {
    UserModel = mongoose.model('User');
} catch (error) {
    UserModel = mongoose.model('User', userSchema);
}

module.exports = { User, UserModel };