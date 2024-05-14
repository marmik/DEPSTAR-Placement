// api/auth/register.js
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

const JWT_SECRET = 'secretKey'; // Define your secret key here

// Register endpoint
router.post('/', (req, res) => {
    const { username, password, userType } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !userType) {
        return res.status(400).json({ error: 'Username, password, and user type are required' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password: ' + err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Insert the user into the database with the determined role
        const sql = 'INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)';
        connection.query(sql, [username, hashedPassword, userType], (err, result) => {
            if (err) {
                console.error('Error creating user: ' + err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Generate JWT token
            const token = jwt.sign({ username, role: userType }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(201).json({ message: 'User created successfully', token });
        });
    });
});


module.exports = router;
