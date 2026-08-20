const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error('Unhandled server error:', err);

    // PostgreSQL Unique Violation
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Resource already exists or duplicate key violation.' });
    }

    // PostgreSQL Foreign Key Violation
    if (err.code === '23503') {
        return res.status(400).json({ error: 'Referenced related record does not exist.' });
    }

    // PostgreSQL Check Constraint Violation
    if (err.code === '23514') {
        return res.status(400).json({ error: 'Input violates database integrity constraints.' });
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
