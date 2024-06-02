const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');

router.use(cors());

// Fetch all raw materials with current stock
router.get('/', (req, res) => {
    const query = `
        SELECT 
            rm.RawMaterialID, 
            rm.RawMaterial, 
            rm.LastUpdate, 
            rm.RawType, 
            COALESCE(SUM(brm.Quantity), 0) AS CurrentStock
        FROM rawmaterial rm
        LEFT JOIN batchrawmaterial brm ON rm.RawMaterialID = brm.RawMaterialID
        GROUP BY rm.RawMaterialID, rm.RawMaterial, rm.LastUpdate, rm.RawType
    `;
    connection.query(query, (error, results) => {
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
    const { rawMaterial, rawType } = req.body;
    const query = 'INSERT INTO rawmaterial (RawMaterial, RawType, LastUpdate) VALUES (?, ?, NOW())';
    const params = [rawMaterial, rawType];
    connection.query(query, params, (error, results) => {
        if (error) {
            console.error('Error adding raw material:', error);
            res.status(500).json({ error: 'Error adding raw material' });
        } else {
            res.json({ message: 'Raw material added successfully' });
        }
    });
});

// Fetch all raw types
router.get('/types', (req, res) => {
    connection.query('SELECT * FROM RawType', (error, results) => {
        if (error) {
            console.error('Error retrieving raw types:', error);
            res.status(500).json({ error: 'Error retrieving raw types' });
        } else {
            res.json(results);
        }
    });
});



module.exports = router;
