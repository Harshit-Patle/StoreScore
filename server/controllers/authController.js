
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const signup = async (req, res) => {
    const { name, email, password, address } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    try {
        const userExists = await db.query('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL', [normalizedEmail]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            `INSERT INTO users (name, email, password_hash, address, role) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
            [name, normalizedEmail, passwordHash, address, 'USER']
        );

        res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during signup.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [normalizedEmail]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } 
        );

        res.json({ token, role: user.rows[0].role, message: 'Logged in successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

const updatePassword = async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current password and new password are required.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            error: 'Password must be 8-16 characters, with at least one uppercase letter and one special character.'
        });
    }

    try {
        const userResult = await db.query(
            'SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isCurrentValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
        if (!isCurrentValid) {
            return res.status(400).json({ error: 'Incorrect current password.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await db.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [passwordHash, userId]
        );

        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error('Password update error:', err);
        res.status(500).json({ error: 'Failed to update password.' });
    }
};

module.exports = { signup, login, updatePassword };