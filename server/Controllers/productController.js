const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');
const multer = require('multer');

router.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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

// Fetch all raw materials
router.get('/rawmaterial', (req, res) => {
  connection.query('SELECT RawMaterialID, RawMaterial AS MaterialName FROM rawmaterial', (error, results) => {
    if (error) {
      console.error('Error retrieving raw materials:', error);
      res.status(500).json({ error: 'Error retrieving raw materials' });
    } else {
      res.json(results);
    }
  });
});

// Add a new product
router.post('/', upload.single('image'), (req, res) => {
  const { productName, workmanCharge, mrp, category } = req.body;
  let rawMaterials = req.body.rawMaterials ? JSON.parse(req.body.rawMaterials) : [];
  const imagePath = req.file ? req.file.path : null;

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const productQuery = 'INSERT INTO product (ProductName, WorkmanCharge, MRP, Category, Image) VALUES (?, ?, ?, ?, ?)';
    connection.query(productQuery, [productName, workmanCharge, mrp, category, imagePath], (productError, productResults) => {
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
router.put('/:productId', upload.single('image'), (req, res) => {
  const productId = req.params.productId;
  const { productName, workmanCharge, mrp, category, existingImagePath } = req.body;
  let rawMaterials = req.body.rawMaterials ? JSON.parse(req.body.rawMaterials) : [];
  const imagePath = req.file ? req.file.path : existingImagePath; // Use the new image if provided, otherwise use the existing image path

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const productUpdateQuery = 'UPDATE product SET ProductName = ?, WorkmanCharge = ?, MRP = ?, Category = ?, Image = ? WHERE ProductID = ?';
    connection.query(productUpdateQuery, [productName, workmanCharge, mrp, category, imagePath, productId], (productError) => {
      if (productError) {
        return connection.rollback(() => {
          console.error('Error updating product:', productError);
          return res.status(500).json({ error: 'Error updating product' });
        });
      }

      if (!Array.isArray(rawMaterials) || rawMaterials.length === 0) {
        connection.commit((commitError) => {
          if (commitError) {
            return connection.rollback(() => {
              console.error('Error committing transaction:', commitError);
              return res.status(500).json({ error: 'Error committing transaction' });
            });
          }
          res.status(200).json({ message: 'Product updated successfully' });
        });
      } else {
        const deleteOldRawMaterialsQuery = 'DELETE FROM productrawmaterial WHERE ProductID = ?';
        connection.query(deleteOldRawMaterialsQuery, [productId], (deleteError) => {
          if (deleteError) {
            return connection.rollback(() => {
              console.error('Error deleting old raw materials:', deleteError);
              return res.status(500).json({ error: 'Error deleting old raw materials' });
            });
          }

          const rawMaterialQueries = rawMaterials.map(({ material, quantity }) => {
            return new Promise((resolve, reject) => {
              const rawMaterialQuery = 'INSERT INTO productrawmaterial (ProductID, RawMaterialID, Quantity) VALUES (?, ?, ?)';
              connection.query(rawMaterialQuery, [productId, material, quantity], (rawMaterialError) => {
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
                res.status(200).json({ message: 'Product updated successfully' });
              });
            })
            .catch((rawMaterialError) => {
              return connection.rollback(() => {
                console.error('Error updating raw materials:', rawMaterialError);
                return res.status(500).json({ error: 'Error updating raw materials' });
              });
            });
        });
      }
    });
  });
});

// Fetch raw materials for a specific product
router.get('/:productId/rawmaterials', (req, res) => {
  const productId = req.params.productId;

  const rawMaterialsQuery = `
    SELECT rm.RawMaterialID AS material, rm.RawMaterial AS materialName, prm.Quantity AS quantity
    FROM productrawmaterial prm
    JOIN rawmaterial rm ON prm.RawMaterialID = rm.RawMaterialID
    WHERE prm.ProductID = ?
  `;

  connection.query(rawMaterialsQuery, [productId], (error, results) => {
    if (error) {
      console.error('Error fetching raw materials:', error);
      return res.status(500).json({ error: 'Error fetching raw materials' });
    }

    res.json(results);
  });
});

module.exports = router;
