const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');

router.use(cors());

// Fetch all products
router.get('/', (req, res) => {
  connection.query('SELECT * FROM product', (error, results) => {
    if (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Error retrieving products' });
    } else {
      res.json(results);
    }
  });
});

// Fetch all categories
router.get('/categories', (req, res) => {
  connection.query('SELECT CategoryID, CategoryName FROM category', (error, results) => {
    if (error) {
      console.error('Error retrieving categories:', error);
      res.status(500).json({ error: 'Error retrieving categories' });
    } else {
      res.json(results);
    }
  });
});

// Fetch all raw materials with unit price
router.get('/rawmaterial', (req, res) => {
  connection.query('SELECT RawMaterialID, RawMaterial, UnitPrice FROM rawmaterial', (error, results) => {
    if (error) {
      console.error('Error retrieving raw materials:', error);
      res.status(500).json({ error: 'Error retrieving raw materials' });
    } else {
      res.json(results);
    }
  });
});

// Add a new product
router.post('/', async (req, res) => {
  const { productName, instock, price, category, rawMaterials } = req.body;

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const productQuery = 'INSERT INTO product (ProductName, InStock, Price, Category) VALUES (?, ?, ?, ?)';
    connection.query(productQuery, [productName, instock, price, category], (productError, productResults) => {
      if (productError) {
        return connection.rollback(() => {
          console.error('Error adding product:', productError);
          return res.status(500).json({ error: 'Error adding product' });
        });
      }

      const productID = productResults.insertId;
      const rawMaterialQueries = rawMaterials.map(({ material, quantity }) => {
        return new Promise((resolve, reject) => {
          const rawMaterialQuery = 'INSERT INTO productrawmaterial (ProductID, RawMaterialID, Quantity) VALUES (?, ?, ?)';
          connection.query(rawMaterialQuery, [productID, material, quantity], (rawMaterialError) => {
            if (rawMaterialError) {
              return reject(rawMaterialError);
            }
            resolve();
          });
        });
      });

      Promise.all(rawMaterialQueries)
        .then(() => {
          connection.commit((commitError) => {
            if (commitError) {
              return connection.rollback(() => {
                console.error('Error committing transaction:', commitError);
                return res.status(500).json({ error: 'Error committing transaction' });
              });
            }
            res.status(201).json({ message: 'Product added successfully' });
          });
        })
        .catch((rawMaterialError) => {
          return connection.rollback(() => {
            console.error('Error adding raw materials:', rawMaterialError);
            return res.status(500).json({ error: 'Error adding raw materials' });
          });
        });
    });
  });
});

// Update an existing product
router.put('/:productId', (req, res) => {
  const productId = req.params.productId;
  const { productName, instock, price, category } = req.body;

  connection.query(
    'UPDATE product SET ProductName = ?, InStock = ?, Price = ?, Category = ? WHERE ProductID = ?',
    [productName, instock, price, category, productId],
    (error) => {
      if (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  );
});

// Fetch raw materials for a specific product
router.get('/productrawmaterial/:productId', (req, res) => {
    const productId = req.params.productId;
    const query = `
      SELECT prm.RawMaterialID, rm.RawMaterial, prm.Quantity 
      FROM productrawmaterial prm 
      JOIN rawmaterial rm ON prm.RawMaterialID = rm.RawMaterialID 
      WHERE prm.ProductID = ?
    `;
    connection.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Error fetching raw materials data:', err);
        res.status(500).json({ error: 'Error fetching raw materials data' });
      } else {
        res.json(results);
      }
    });
  });
  

module.exports = router;
