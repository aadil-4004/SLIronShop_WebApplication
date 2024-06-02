const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');

// Enable CORS for all routes
router.use(cors());

// Fetch all suppliers with their raw type names
router.get('/suppliers', (req, res) => {
    const query = `
        SELECT s.SupplierID, s.SupplierName, rt.RawTypeName AS RawType, s.Email, s.ContactNum
        FROM supplier s
        JOIN rawtype rt ON s.RawType = rt.RawTypeID
    `;
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving suppliers:', error);
            res.status(500).json({ error: 'Error retrieving suppliers' });
        } else {
            res.json(results);
        }
    });
});

// Add a new supplier
router.post('/suppliers', (req, res) => {
    const { supplierName, rawType, email, contactNum } = req.body;
    const query = 'INSERT INTO supplier (SupplierName, RawType, Email, ContactNum) VALUES (?, ?, ?, ?)';
    connection.query(query, [supplierName, rawType, email, contactNum], (error, results) => {
        if (error) {
            console.error('Error adding supplier:', error);
            res.status(500).json({ error: 'Error adding supplier' });
        } else {
            res.json({ message: 'Supplier added successfully' });
        }
    });
});

// Update an existing supplier
router.put('/suppliers/:supplierId', (req, res) => {
    const supplierId = req.params.supplierId;
    const { supplierName, rawType, email, contactNum } = req.body;
    const query = 'UPDATE supplier SET SupplierName = ?, RawType = ?, Email = ?, ContactNum = ? WHERE SupplierID = ?';
    connection.query(query, [supplierName, rawType, email, contactNum, supplierId], (error, results) => {
        if (error) {
            console.error('Error updating supplier:', error);
            res.status(500).json({ error: 'Error updating supplier' });
        } else {
            res.json({ message: 'Supplier updated successfully' });
        }
    });
});

// Fetch all raw types
router.get('/rawtypes', (req, res) => {
    connection.query('SELECT * FROM rawtype', (error, results) => {
        if (error) {
            console.error('Error retrieving raw types:', error);
            res.status(500).json({ error: 'Error retrieving raw types' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
