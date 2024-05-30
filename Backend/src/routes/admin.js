// const express = require('express');
// const jwt = require('jsonwebtoken');
// const mysql = require('mysql');
// const vToken = require('./../middlewares/middleware.js');
// require('dotenv').config();


// const app = express();
// const router = express.Router();
// router.use(express.json());

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: '',
//     database: process.env.DB_NAME
// });



// // Route to add a new user
// router.get('/',vToken , (req,res) => {
//     res.send("success");
// })  // tested


// router.post('/add_users',vToken, (req, res) => {
//     const data = req.body;
//     connection.query("INSERT INTO users SET ?", data, (error, results, fields) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal Server Error or please check the details again' });
//         }
//         else
//         {
//             res.json({message : "user added successfully"});
//         }
        
//     });
// });  // tested


// // Route to update user information
// router.put('/update_users/:old_username',vToken, (req, res) => {
//     const old_username = req.params.old_username;
//     const { new_username,new_password } = req.body;
//     const query = 'UPDATE users SET username = ?, password = ? WHERE username = ?';
//     connection.query(query, [new_username,new_password,old_username], (error, results) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         else
//         {
//             res.json({ message: 'User information updated successfully' });

//         }        
//     });
// });  // tested

// // Route to delete a user
// router.delete('/delete_user/:username', vToken, (req, res) => {
//     const username = req.params.username;
//     const query = 'DELETE FROM users WHERE Username = ?';
//     connection.query(query, [username], (error, results) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         } else {
//             if (results.affectedRows === 0) {
//                 // If no rows were affected, the user might not exist
//                 return res.status(404).json({ message: 'User not found' });
//             } else {
//                 // User deleted successfully
//                 return res.json({ message: 'User deleted successfully' });
//             }
//         }
//     });
// });


// // Route to get all system settings
// router.get('/settings',vToken, (req, res) => {
//     const query = 'SELECT * FROM systemsettings';
//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         else
//         {
//             res.json(results);
//         }
        
//     });
// }); // done

// // Route to update a specific system setting
// router.put('/update_settings/:settingname',vToken, (req, res) => {
//     const settingName = req.params.settingname;
//     const settingValue = req.body.settingvalue; // Changed to lowercase 'settingValue'
    
//     // Ensure that settingValue is not undefined or null
//     if (settingValue === undefined || settingValue === null) {
//         return res.status(400).json({ message: 'SettingValue is missing in request body' });
//     }

//     const query = 'UPDATE systemsettings SET SettingValue = ? WHERE SettingName = ?';
//     connection.query(query, [settingValue, settingName], (error, results) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         // Check if any rows were affected by the update
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ message: 'Setting not found' });
//         }
//         // If the update was successful
//         res.json({ message: 'Setting updated successfully' });
//     });
// }); //done


// module.exports = router

// // Route to get system reports
// // app.get('/api/admin/reports',(req, res) => {
// //     const query = 'SELECT * FROM reports';
// //     connection.query(query, (error, results) => {
// //         if (error) {
// //             console.error(error);
// //             return res.status(500).json({ message: 'Internal Server Error' });
// //         }
// //         res.json(results);
// //     });
// // });

//New Code by Marmik Patel

const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const vToken = require('./../middlewares/middleware.js');
require('dotenv').config();
const { verifyToken, checkRole } = vToken;

const app = express();
const router = express.Router();
router.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD, // Use environment variable for the password
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        path: process.env.DB_SOCKET_PATH
    });

// Route to add a new user
router.post('/add_user', verifyToken, checkRole('Admin'), (req, res) => {
    const { username, password, role } = req.body;
    const query = 'INSERT INTO users (Username, Password, Role) VALUES (?, ?, ?)';
    connection.query(query, [username, password, role], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error or please check the details again' });
        } else {
            res.json({ message: `${role} added successfully` });
        }
    });
});

// Route to update user information
router.put('/update_user/:old_username', verifyToken, checkRole('Admin'), (req, res) => {
    const old_username = req.params.old_username;
    const { new_username, new_password } = req.body;
    const query = 'UPDATE users SET username = ?, password = ? WHERE username = ?';
    connection.query(query, [new_username, new_password, old_username], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.json({ message: 'User information updated successfully' });
        }
    });
});

// Route to delete a user
router.delete('/delete_user/:username', verifyToken, checkRole('Admin'), (req, res) => {
    const username = req.params.username;
    const query = 'DELETE FROM users WHERE Username = ?';
    connection.query(query, [username], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } else {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                return res.json({ message: 'User deleted successfully' });
            }
        }
    });
});

// Route to get all system settings
router.get('/settings', verifyToken, checkRole('Admin'), (req, res) => {
    const query = 'SELECT * FROM systemsettings';
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

// Route to update a specific system setting
router.put('/update_settings/:settingname', verifyToken, checkRole('Admin'), (req, res) => {
    const settingName = req.params.settingname;
    const settingValue = req.body.settingvalue;
    if (settingValue === undefined || settingValue === null) {
        return res.status(400).json({ message: 'SettingValue is missing in request body' });
    }
    const query = 'UPDATE systemsettings SET SettingValue = ? WHERE SettingName = ?';
    connection.query(query, [settingValue, settingName], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json({ message: 'Setting updated successfully' });
    });
});

module.exports = router;