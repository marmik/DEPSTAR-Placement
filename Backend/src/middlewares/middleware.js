// Import required modules
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is loaded correctly

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    // port: process.env.DB_PORT,
    // socketPath: process.env.DB_SOCKET_PATH
});

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
    // const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        pool.query('SELECT userID, Username, Role FROM users WHERE Username = ?', [decoded.username], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            req.user = results[0]; // Attach user information to the request object
            next();
        });
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

// Middleware to check if user has the required role
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.Role !== requiredRole) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };
