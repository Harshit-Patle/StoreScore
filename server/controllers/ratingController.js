const db = require('../db');

const submitRating = async (req, res, next) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    if (!storeId || isNaN(Number(storeId))) {
        return res.status(400).json({ error: 'Valid numeric storeId is required.' });
    }

    try {
        const storeCheck = await db.query('SELECT id FROM stores WHERE id = $1 AND deleted_at IS NULL', [storeId]);
        if (storeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found.' });
        }

        const existingRating = await db.query(
            'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2 AND deleted_at IS NULL',
            [userId, storeId]
        );

        if (existingRating.rows.length > 0) {
            await db.query(
                'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [parsedRating, existingRating.rows[0].id]
            );
            return res.json({ message: 'Rating updated successfully.' });
        } else {
            await db.query(
                'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
                [userId, storeId, parsedRating]
            );
            return res.status(201).json({ message: 'Rating submitted successfully.' });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { submitRating };