const AuthService = require('../services/AuthService');

class AuthController {
    static async register(req, res) {
        const { username, password } = req.body;
        const result = await AuthService.register(username, password);
        
        if (result.success) {
            res.status(201).json({ message: 'User created successfully', user: result.user });
        } else {
            res.status(400).json({ error: result.error });
        }
    }

    static async login(req, res) {
        const { username, password } = req.body;
        const result = await AuthService.login(username, password);
        
        if (result.success) {
            res.json({ token: result.token, username: result.username });
        } else {
            res.status(400).json({ error: result.error });
        }
    }
}

module.exports = AuthController;
