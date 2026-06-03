
const bcrypt = require('bcrypt');
const db = require('../db');

const getDashboardStats = async (req, res) => {
    try {
        const usersCount = await db.query('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL');
        const storesCount = await db.query('SELECT COUNT(*) FROM stores WHERE deleted_at IS NULL');
        const ratingsCount = await db.query('SELECT COUNT(*) FROM ratings WHERE deleted_at IS NULL');

        res.json({
            totalUsers: parseInt(usersCount.rows[0].count),
            totalStores: parseInt(storesCount.rows[0].count),
            totalRatings: parseInt(ratingsCount.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, u.address, u.role,
                   COALESCE(ROUND(AVG(r.rating), 1), 0) as owner_rating
            FROM users u
            LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'STORE_OWNER' AND s.deleted_at IS NULL
            LEFT JOIN ratings r ON s.id = r.store_id AND r.deleted_at IS NULL
            WHERE u.deleted_at IS NULL
            GROUP BY u.id
            ORDER BY u.name ASC
        `;
        const users = await db.query(query);
        res.json(users.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getAllStores = async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.name, s.email, s.address, 
                   COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating 
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id AND r.deleted_at IS NULL
            WHERE s.deleted_at IS NULL
            GROUP BY s.id
            ORDER BY s.name ASC
        `;
        const stores = await db.query(query);
        res.json(stores.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
};

const createUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be 8-16 chars, 1 uppercase, 1 special character.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await db.query(
            `INSERT INTO users (name, email, password_hash, address, role) 
             VALUES ($1, $2, $3, $4, $5)`,
            [name, email, passwordHash, address, role]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user. Email may already exist.' });
    }
};

const createStore = async (req, res) => {
    const { name, email, address, ownerId } = req.body;

    try {
        await db.query(
            `INSERT INTO stores (name, email, address, owner_id) 
             VALUES ($1, $2, $3, $4)`,
            [name, email, address, ownerId]
        );
        res.status(201).json({ message: 'Store created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create store.' });
    }
};

module.exports = { getDashboardStats, getAllUsers, getAllStores, createUser, createStore };