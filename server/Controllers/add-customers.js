const express = require('express');
const router = express.Router();
const connection = require('../Config/db');

router.post('/', (req, res) => {
    const { firstName, lastName, email, contactNum, address } = req.body;

    connection.query('INSERT INTO customers (FirstName, LastName, Email, ContactNum, Address) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, contactNum, address],
        (error, results) => {
            if (error) {
                console.error('Error adding customer:', error);
                res.status(500).json({ error: 'Error adding customer' });
            } else {
                res.status(201).json({ message: 'Customer added successfully' });
            }
        });
});

module.exports = router;
