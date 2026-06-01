const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // Imports the database connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows Express to parse JSON bodies from the frontend

// Health Check Route (Just to test if it's working)
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the StoreScore API!' });
});

// We will mount our Auth and User routes here next...

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});