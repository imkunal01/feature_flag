// Polyfill for Web Crypto API in older Node.js versions (Node < 19)
if (typeof crypto === 'undefined') {
    global.crypto = require('crypto').webcrypto;
}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`✗ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Connect to DB before starting server
connectDB();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const statusMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        res.send({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: {
                state: statusMap[dbStatus],
                connected: dbStatus === 1
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
