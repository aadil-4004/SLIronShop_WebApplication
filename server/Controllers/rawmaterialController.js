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

router.get('/low-stock-raw-materials', (req, res) => {
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
      HAVING CurrentStock < 10
      ORDER BY CurrentStock
    `;
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching low stock raw materials:', error);
        res.status(500).json({ error: 'Error fetching low stock raw materials' });
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

// Fetch batches for a specific raw material
router.get('/:rawMaterialId/batches', (req, res) => {
    const rawMaterialId = req.params.rawMaterialId;

    const batchQuery = `
      SELECT br.BatchID, br.RawMaterialID, br.Quantity, br.UnitPrice, br.DateReceived, s.SupplierName
      FROM batchrawmaterial br
      JOIN supplier s ON br.SupplierID = s.SupplierID
      WHERE br.RawMaterialID = ?
    `;

    connection.query(batchQuery, [rawMaterialId], (error, results) => {
      if (error) {
        console.error('Error fetching batches:', error);
        return res.status(500).json({ error: 'Error fetching batches' });
      }

      res.json(results);
    });
});


module.exports = router;
