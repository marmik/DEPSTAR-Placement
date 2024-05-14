const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "secretKey"; // Ensure this matches the secret used in login.js

function verifyToken(req, res, next) {
    let token = req.headers["authorization"];
    token = token && token.split(" ")[1]; // Assuming Authorization: Bearer <token>

    if (!token) {
        return res.status(403).json({ message: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    return next();
}

module.exports = verifyToken;
