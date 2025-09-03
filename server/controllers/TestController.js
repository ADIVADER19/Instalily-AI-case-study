class TestController {
    static test(req, res) {
        res.json({ 
            message: 'API is working!', 
            timestamp: new Date().toISOString() 
        });
    }
}

module.exports = TestController;
