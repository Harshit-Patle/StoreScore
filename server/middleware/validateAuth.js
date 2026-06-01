
const validateSignup = (req, res, next) => {
    const { name, email, password, address } = req.body;

    if (!name || name.length < 20 || name.length > 60) {
        return res.status(400).json({ error: 'Name must be between 20 and 60 characters.' });
    }

    if (!address || address.length > 400) {
        return res.status(400).json({ error: 'Address cannot exceed 400 characters.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'Password must be 8-16 characters, including at least one uppercase letter and one special character.'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    next();
};

module.exports = { validateSignup };