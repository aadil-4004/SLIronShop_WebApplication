const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');

// Enable CORS for all routes
router.use(cors());

// Fetch all suppliers
router.get('/', (req, res) => {
    connection.query('SELECT * FROM supplier', (error, results) => {
        if (error) {
            console.error('Error retrieving suppliers:', error);
            res.status(500).json({ error: 'Error retrieving suppliers' });
        } else {
            res.json(results);
        }
    });
});

// Add a new supplier
router.post('/', (req, res) => {
    const { supplierName, type, email, contactNum } = req.body;
    connection.query('INSERT INTO supplier (SupplierName, Type, Email, ContactNum) VALUES (?, ?, ?, ?)',
    [supplierName, type, email, contactNum], (error, results) => {
        if (error) {
            console.error('Error adding supplier:', error);
            res.status(500).json({ error: 'Error adding supplier' });
        } else {
            res.json({ message: 'Supplier added successfully' });
        }
    });
});

// Update an existing supplier
router.put('/:supplierId', (req, res) => {
    const supplierId = req.params.supplierId;
    const { supplierName, type, email, contactNum } = req.body;
    connection.query('UPDATE supplier SET SupplierName = ?, Type = ?, Email = ?, ContactNum = ? WHERE SupplierID = ?',
    [supplierName, type, email, contactNum, supplierId], (error, results) => {
        if (error) {
            console.error('Error updating supplier:', error);
            res.status(500).json({ error: 'Error updating supplier' });
        } else {
            res.json({ message: 'Supplier updated successfully' });
        }
    });
});

module.exports = router;
