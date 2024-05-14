const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const router = express.Router();
const secretKey = process.env.JWT_SECRET || "secretKey"; // Consider storing secret in environment variables

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "db_QuizApp",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

router.use(express.json());

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const query = "SELECT id, username, password, role FROM users WHERE username = ?";
        const results = await queryDatabase(pool, query, [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

function queryDatabase(pool, sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

module.exports = router;
