const express = require('express');
const ChatController = require('../controllers/ChatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', authenticateToken, ChatController.chat);
router.get('/chat/history', authenticateToken, ChatController.getHistory);
router.delete('/chat/history', authenticateToken, ChatController.clearHistory);
router.post('/recommend', authenticateToken, ChatController.recommend);
router.post('/troubleshoot', authenticateToken, ChatController.troubleshoot);

module.exports = router;
