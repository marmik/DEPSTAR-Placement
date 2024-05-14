const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'db_QuizApp',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Secret key for JWT
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNTU3OTI5MywiaWF0IjoxNzE1NTc5MjkzfQ.lNVMFb3JJnrHoHku2IykBU9WdjpVhecXmlX3WdTjvj8';

// User login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body; // Corrected to use 'username'

    // Retrieve user from the database based on username
    const sql = 'SELECT * FROM Users WHERE Username = ?';
    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user: ' + err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        // Compare hashed password
        bcrypt.compare(password, user.Password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords: ' + err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Passwords match
            if (result) {
                // Generate JWT token
                const token = jwt.sign({ userId: user.UserID, role: user.Role }, JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

module.exports = router;
