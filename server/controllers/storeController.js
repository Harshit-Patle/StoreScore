
const db = require('../db');

const getStoresForUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT s.id, s.name, s.address, 
                   COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating,
                   ur.rating as user_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id AND r.deleted_at IS NULL
            LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1 AND ur.deleted_at IS NULL
            WHERE s.deleted_at IS NULL
            GROUP BY s.id, ur.rating
            ORDER BY s.name ASC
        `;

        const stores = await db.query(query, [userId]);
        res.json(stores.rows);
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).json({ error: 'Failed to fetch stores.' });
    }
};

module.exports = { getStoresForUser };