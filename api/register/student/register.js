const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

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

// Middleware for JSON parsing
router.use(express.json());

// User registration endpoint
router.post('/', (req, res) => { // Change the route to '/'
    const { username, password } = req.body;

    // Validate username and password
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password: ' + err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Insert user into the database
        const sql = 'INSERT INTO Users (Username, Password) VALUES (?, ?)';
        connection.query(sql, [username, hash], (err, result) => {
            if (err) {
                console.error('Error registering user: ' + err);
                return res.status(500).json({ error: 'Failed to register user' });
            }
            console.log('User registered successfully');
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

module.exports = router;
