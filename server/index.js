const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});