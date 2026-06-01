
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
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await db.query(
            'SELECT id, name, email, address, role FROM users WHERE deleted_at IS NULL ORDER BY name ASC'
        );
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

module.exports = { getDashboardStats, getAllUsers, getAllStores };