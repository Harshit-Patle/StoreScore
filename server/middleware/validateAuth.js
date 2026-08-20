const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['ADMIN', 'STORE_OWNER', 'USER'];

const validateSignup = (req, res, next) => {
    const { name, email, password, address } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 20 || name.trim().length > 60) {
        return res.status(400).json({ error: 'Name must be between 20 and 60 characters.' });
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0 || address.length > 400) {
        return res.status(400).json({ error: 'Address is required and cannot exceed 400 characters.' });
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
        return res.status(400).json({
            error: 'Password must be 8-16 characters, including at least one uppercase letter and one special character.'
        });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    next();
};

const validateCreateUser = (req, res, next) => {
    const { name, email, password, address, role } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 20 || name.trim().length > 60) {
        return res.status(400).json({ error: 'Name must be between 20 and 60 characters.' });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
        return res.status(400).json({
            error: 'Password must be 8-16 characters, including at least one uppercase letter and one special character.'
        });
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0 || address.length > 400) {
        return res.status(400).json({ error: 'Address is required and cannot exceed 400 characters.' });
    }

    if (!role || !VALID_ROLES.includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be ADMIN, STORE_OWNER, or USER.' });
    }

    next();
};

const validateCreateStore = (req, res, next) => {
    const { name, email, address, ownerId } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 255) {
        return res.status(400).json({ error: 'Store name is required (max 255 characters).' });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Invalid store email format.' });
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0 || address.length > 400) {
        return res.status(400).json({ error: 'Store address is required and cannot exceed 400 characters.' });
    }

    if (!ownerId || isNaN(Number(ownerId))) {
        return res.status(400).json({ error: 'A valid numeric store owner ID is required.' });
    }

    next();
};

module.exports = {
    PASSWORD_REGEX,
    EMAIL_REGEX,
    VALID_ROLES,
    validateSignup,
    validateCreateUser,
    validateCreateStore
};