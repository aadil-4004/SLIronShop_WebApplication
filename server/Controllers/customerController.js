const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors'); // Import the cors package

// Enable CORS for all routes
router.use(cors());

// Fetch all customers
router.get('/', (req, res) => {
    connection.query('SELECT * FROM customers', (error, results) => {
        if (error) {
            console.error('Error retrieving customers:', error);
            res.status(500).json({ error: 'Error retrieving customers' });
        } else {
            res.json(results);
        }
    });
});

// Add a new customer
router.post('/', (req, res) => {
    const { customerName, email, contactNum, address } = req.body;
    connection.query('INSERT INTO customers (CustomerName, Email, ContactNum, Address) VALUES (?, ?, ?, ?)',
    [customerName, email, contactNum, address], (error, results) => {
        if (error) {
            console.error('Error adding customer:', error);
            res.status(500).json({ error: 'Error adding customer' });
        } else {
            res.json({ message: 'Customer added successfully' });
        }
    });
});

// Update an existing customer
router.put('/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const { customerName, email, contactNum, address } = req.body;
    connection.query('UPDATE customers SET CustomerName = ?, Email = ?, ContactNum = ?, Address = ? WHERE CustomerID = ?',
    [customerName, email, contactNum, address, customerId], (error, results) => {
        if (error) {
            console.error('Error updating customer:', error);
            res.status(500).json({ error: 'Error updating customer' });
        } else {
            res.json({ message: 'Customer updated successfully' });
        }
    });
});

module.exports = router;
