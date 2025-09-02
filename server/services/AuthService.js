const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

class AuthService {
    static async signup(username, password) {
        try {
            const user = await User.create(username, password);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async login(username, password) {
        try {
            const user = await User.findByUsername(username);
            if (!user) {
                return { success: false, error: 'Invalid credentials' };
            }

            const isMatch = await User.verifyPassword(user.password, password);
            if (!isMatch) {
                return { success: false, error: 'Invalid credentials' };
            }

            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            return { 
                success: true, 
                token, 
                username: user.username 
            };
        } catch (error) {
            return { success: false, error: 'Server error' };
        }
    }
}

module.exports = AuthService;
