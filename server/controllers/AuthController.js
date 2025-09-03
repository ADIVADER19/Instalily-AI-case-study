const AuthService = require('../services/AuthService');

class AuthController {
    static async register(req, res) {
        try {
            const { username, password } = req.body;
            
            // Validate input
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const result = await AuthService.register(username, password);
            
            if (result.success) {
                res.status(201).json({ message: 'User created successfully', user: result.user });
            } else {
                res.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            
            // Validate input
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const result = await AuthService.login(username, password);
            
            if (result.success) {
                res.json({ token: result.token, username: result.username });
            } else {
                res.status(401).json({ error: result.error });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = AuthController;
