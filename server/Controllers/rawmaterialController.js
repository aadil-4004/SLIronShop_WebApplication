const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');

router.use(cors());

// Fetch all raw materials
router.get('/', (req, res) => {
    connection.query('SELECT * FROM rawmaterial', (error, results) => {
        if (error) {
            console.error('Error retrieving raw materials:', error);
            res.status(500).json({ error: 'Error retrieving raw materials' });
        } else {
            res.json(results);
        }
    });
});

// Add a new raw material
router.post('/', (req, res) => {
    const { rawMaterial, lastUpdate, currentStock, unitPrice } = req.body; // Add unitPrice
    connection.query('INSERT INTO rawmaterial (RawMaterial, LastUpdate, CurrentStock, UnitPrice) VALUES (?, ?, ?, ?)',
    [rawMaterial, lastUpdate, currentStock, unitPrice], (error, results) => { // Include unitPrice in the query parameters
        if (error) {
            console.error('Error adding raw material:', error);
            res.status(500).json({ error: 'Error adding raw material' });
        } else {
            res.json({ message: 'Raw material added successfully' });
        }
    });
});

// Update an existing raw material
router.put('/:rawMaterialId', (req, res) => {
    const rawMaterialId = req.params.rawMaterialId;
    const { rawMaterial, lastUpdate, currentStock, unitPrice } = req.body; // Add unitPrice
    connection.query('UPDATE rawmaterial SET RawMaterial = ?, LastUpdate = ?, CurrentStock = ?, UnitPrice = ? WHERE RawMaterialID = ?',
    [rawMaterial, lastUpdate, currentStock, unitPrice, rawMaterialId], (error, results) => { // Include unitPrice in the query parameters
        if (error) {
            console.error('Error updating raw material:', error);
            res.status(500).json({ error: 'Error updating raw material' });
        } else {
            res.json({ message: 'Raw material updated successfully' });
        }
    });
});




module.exports = router;
