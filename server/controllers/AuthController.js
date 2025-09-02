const AuthService = require('../services/AuthService');

class AuthController {
    static async signup(req, res) {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const result = await AuthService.signup(username, password);
        
        if (result.success) {
            res.status(201).json({ 
                message: 'User created successfully', 
                user: result.user 
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    }

    static async login(req, res) {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const result = await AuthService.login(username, password);
        
        if (result.success) {
            res.json({ 
                token: result.token, 
                username: result.username 
            });
        } else {
            const statusCode = result.error === 'Invalid credentials' ? 400 : 500;
            res.status(statusCode).json({ error: result.error });
        }
    }
}

module.exports = AuthController;
