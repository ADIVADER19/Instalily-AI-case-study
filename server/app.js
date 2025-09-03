const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', testRoutes);
app.use('/api', authRoutes);
app.use('/api', chatRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
