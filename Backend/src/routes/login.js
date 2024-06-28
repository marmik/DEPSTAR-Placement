// Import required modules
const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Create connection pool for MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: "Z",
    // port: process.env.DB_PORT,
    // socketPath: process.env.DB_SOCKET_PATH // Ensure the correct path variable
});

// Create express app
const app = express();
const router = express.Router();

app.use(cookieParser());

// Middleware to parse JSON bodies
router.use(express.json());

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query database to find user
    pool.query('SELECT * FROM users WHERE Username = ?', [username], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare provided password with stored password (not using bcrypt)
        if (password !== user.Password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const userId = user.UserID;
        // const username = user.username;/
        const role = user.Role;
        const sem  = user.sem;
        const classs  = user.class;
        const batch  = user.batch;

        let dashboard;
        if (role === "Admin") {
            dashboard = "Admin";
        } else if (role === "Faculty") {
            dashboard = "Faculty";
        } else {
            dashboard = "Student";
        }

        // Generate JWT token
        const accessToken = jwt.sign({ username: username, role: role, userID: userId , sem :sem ,classs :classs ,batch :batch }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Cookie options
        // const cookieOptions = {
        //     httpOnly: true, // Accessible only by web server
        //     secure: process.env.NODE_ENV === 'production', // Send only over HTTPS when in production
        //     sameSite: 'strict', // Helps prevent CSRF attacks
        //     maxAge: 60 * 60 * 1000 // 1 hour
        // };

        // Set the cookie
        // res.cookie('accessToken', accessToken, cookieOptions);

        // Send response
        res.json({
            role: dashboard,
            token: accessToken,
            status: "User logged in successfully"
        });
    });
});

module.exports = router;
