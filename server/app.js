const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Normalize AWS API Gateway stage prefixes if present
app.use((req, res, next) => {
    if (req.url.startsWith('/default')) {
        req.url = req.url.replace(/^\/default/, '') || '/';
    }
    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the StoreScore API!' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
const ratingRoutes = require('./routes/ratingRoutes');
app.use('/api/ratings', ratingRoutes);
const storeRoutes = require('./routes/storeRoutes');
app.use('/api/stores', storeRoutes);
const ownerRoutes = require('./routes/ownerRoutes');
app.use('/api/owner', ownerRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
