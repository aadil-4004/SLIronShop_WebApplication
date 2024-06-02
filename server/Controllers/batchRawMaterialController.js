const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');

router.use(cors());

// Fetch all batches
router.get('/', (req, res) => {
    connection.query('SELECT * FROM batchrawmaterial', (error, results) => {
        if (error) {
            console.error('Error retrieving batches:', error);
            res.status(500).json({ error: 'Error retrieving batches' });
        } else {
            res.json(results);
        }
    });
});

// Add a new batch
router.post('/',(req, res) => {
    const { RawMaterialID, Quantity, UnitPrice, DateReceived, SupplierID } = req.body;
    const query = 'INSERT INTO batchrawmaterial (RawMaterialID, Quantity, UnitPrice, DateReceived, SupplierID, LastUpdate) VALUES (?, ?, ?, ?, ?,?)';
    const params = [RawMaterialID, Quantity, UnitPrice, DateReceived, SupplierID,new Date()];
    connection.query(query, params, (error, results) => {
        if (error) {
            console.error('Error adding batch:', error);
            res.status(500).json({ error: 'Error adding batch' });
        } else {
            res.json({ message: 'Batch added successfully' });
        }
    });
});

// Fetch suppliers based on raw type
router.get('/suppliers', (req, res) => {
    const rawType = req.query.rawType;
    const query = 'SELECT * FROM supplier WHERE RawType = ?';
    connection.query(query, [rawType], (error, results) => {
        if (error) {
            console.error('Error retrieving suppliers:', error);
            res.status(500).json({ error: 'Error retrieving suppliers' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
