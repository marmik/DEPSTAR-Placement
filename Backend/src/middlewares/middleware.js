// api/auth/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const JWT_SECRET = 'yourSecretKey'; // Replace with your own secret key


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'charusat_internship'
});
// Middleware function to verify JWT token
const  verifyToken = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers('authorization')?.replace("Bearer ","");
    console.log(token);

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        // console.log(decoded);
        const user = await pool.query('SELECT userID, Username, Role FROM users WHERE Username = ?', [decoded?.username], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({error: 'Internal server error' });
            }

            // console.log(decoded?.username);

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // const user = results[0];
            req.user = user;
            next();
        });

        // req.user = decoded;
        // next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

module.exports = verifyToken;
