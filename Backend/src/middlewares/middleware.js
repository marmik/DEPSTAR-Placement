const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    socketPath: process.env.DB_SOCKET_PATH
});

const verifyToken = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        pool.query('SELECT userID, Username, Role FROM users WHERE Username = ?', [decoded.username], (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            req.user = {
                userID: results[0].userID,
                username: results[0].Username,
                role: results[0].Role
            }; // Attach user information to the request object

            next();
        });
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };
