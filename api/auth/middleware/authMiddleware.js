const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "secretKey"; // Ensure this matches the secret used in login.js
const tokenPath = "/api/auth/login";

// function verifyToken(req, res, next) {
//     let token = req.headers["authorization"];
//     token = token && token.split(" ")[1]; // Assuming Authorization: Bearer <token>

//     if (!token) {
//         return res.status(403).json({ message: "A token is required for authentication" });
//     }

//     try {
//         const decoded = jwt.verify(token, secretKey);
//         req.user = decoded;
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token" });
//     }

//     return next();
// }

// Function to verify JWT token


module.exports = function verifyToken(req, res, next) {
    const token = tokenPath;
  
    if (!token) {
      return res.status(403).json({ message: 'Token is missing' });
    }
  
    jwt.verify(token, secretKey, (error, authData) => {
      if (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
      }
      else{
          res.send({message:"dashboard access",
                      authData
          })
      }
  
      req.username = decoded.username;
      next();
    });
  }

//module.exports = verifyToken;
