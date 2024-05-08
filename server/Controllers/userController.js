const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Config/db');
const bcrypt = require('bcrypt');
const validator = require('validator');

const router = express.Router();

router.use(bodyParser.json());

router.post('/register', (req, res) => {
    const { Username, Password, FirstName, LastName, NIC, Email, PhoneNumber, Address, Role } = req.body;

    // Hash password
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if username, NIC, email, and phone number already exist
        connection.query('SELECT * FROM User WHERE Username = ? OR NIC = ? OR Email = ? OR PhoneNumber = ?', [Username, NIC, Email, PhoneNumber], (err, rows) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length > 0) {
                const existingFields = rows[0];
                let errors = {};

                if (existingFields.Username === Username) {
                    errors.Username = 'Username already exists';
                }
                
                if (existingFields.NIC === NIC) {
                    errors.NIC = 'NIC already exists';
                }
                
                if (existingFields.Email === Email) {
                    if(!existingFields.Email === ""){
                        errors.Email = 'Email already exists';
                    }
                }

                if (existingFields.PhoneNumber === PhoneNumber) {
                    errors.PhoneNumber = 'Phone number already exists';
                }

                res.status(400).json({ error: 'Fields already exist', errors });
                return;
                
            }else{

            // Insert new user into database with hashed password
            connection.query('INSERT INTO User (Username, Password, FirstName, LastName, NIC, Email, PhoneNumber, Address, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Username, hashedPassword, FirstName, LastName, NIC, Email, PhoneNumber, Address, Role], 
            (err, result) => {
                if (err) {
                    console.error('Error inserting into MySQL database:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }else{
                    res.status(201).json({ message: 'User registered successfully', UserId: result.insertId });
                } 
            });
            }
        });
    });
});


router.put('/update/:id', async (req, res, next) => {
    const userId = req.params.id;
    const { Username, Password, FirstName, LastName, NIC, Email, PhoneNumber, Address, Role } = req.body;

    try {
        const hashedPassword = Password ? await bcrypt.hash(Password, 10) : null;

        let query = 'UPDATE User SET Username = ?, FirstName = ?, LastName = ?, NIC = ?, Email = ?, PhoneNumber = ?, Address = ?, Role = ?';
        let params = [Username, FirstName, LastName, NIC, Email, PhoneNumber, Address, Role];

        if (hashedPassword) {
            query += ', Password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE UserID = ?';
        params.push(userId);

        const result = await connection.query(query, params);

        if (Array.isArray(result) && result[0].affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User updated successfully', UserId: userId });

    } catch (err) {
        console.error('Error updating MySQL database:', err);
        next(err);
    }
});





module.exports = router;
