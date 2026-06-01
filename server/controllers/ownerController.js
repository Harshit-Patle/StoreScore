const db = require('../db');

const getOwnerDashboard = async (req, res) => {
    const ownerId = req.user.id;

    try {
        const storeResult = await db.query(
            'SELECT id, name, address, email FROM stores WHERE owner_id = $1 AND deleted_at IS NULL',
            [ownerId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({ error: 'No store found for this owner.' });
        }

        const store = storeResult.rows[0];

        const ratingsResult = await db.query(
            `SELECT r.id, r.rating, u.name as user_name, u.email as user_email 
             FROM ratings r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.store_id = $1 AND r.deleted_at IS NULL 
             ORDER BY r.created_at DESC`,
            [store.id]
        );

        const ratings = ratingsResult.rows;
        const avgRating = ratings.length > 0
            ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
            : 0;

        res.json({
            store,
            ratings,
            averageRating: avgRating,
            totalRatings: ratings.length
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to load owner dashboard.' });
    }
};

module.exports = { getOwnerDashboard };