const express = require('express');
const ChatController = require('../controllers/ChatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/chat', ChatController.chat);
router.get('/chat/history', ChatController.getChatHistory);
router.post('/recommend', ChatController.recommend);
router.post('/troubleshoot', ChatController.troubleshoot);

module.exports = router;
