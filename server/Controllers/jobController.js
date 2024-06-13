const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');
const multer = require('multer');

router.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Fetch all jobs with customer details
router.get('/', (req, res) => {
  const query = `
    SELECT j.*, c.CustomerName 
    FROM jobs j 
    JOIN customers c ON j.CustomerID = c.CustomerID
    ORDER BY j.JobID
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ error: 'Error retrieving jobs' });
    } else {
      res.json(results);
    }
  });
});


// Update job status
router.put('/:jobId/status', (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;

  const query = 'UPDATE jobs SET Status = ? WHERE JobID = ?';
  connection.query(query, [status, jobId], (error, results) => {
    if (error) {
      console.error('Error updating job status:', error);
      res.status(500).json({ error: 'Error updating job status' });
    } else {
      res.status(200).json({ message: 'Job status updated successfully' });
    }
  });
});

// Add a new job
router.post('/', upload.single('image'), (req, res) => {
  console.log('Request Body:', req.body);

  const { dueDate, status, customerID, note, assignedEmployee, customProductName } = req.body;
  let products = [];
  let rawMaterials = [];

  try {
    products = req.body.products ? JSON.parse(req.body.products) : [];
    rawMaterials = req.body.rawMaterials ? JSON.parse(req.body.rawMaterials) : [];
  } catch (error) {
    console.error('Error parsing products or raw materials:', error);
    return res.status(400).json({ error: 'Invalid JSON format for products or raw materials' });
  }

  const imagePath = req.file ? req.file.path : null;

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction', details: transactionError });
    }

    // Insert job details into the jobs table
    const jobQuery = 'INSERT INTO jobs (DueDate, Status, CustomerID, Note, EmployeeName) VALUES (?, ?, ?, ?, ?)';
    connection.query(jobQuery, [dueDate, status, customerID, note, assignedEmployee], (jobError, jobResults) => {
      if (jobError) {
        return connection.rollback(() => {
          console.error('Error adding job:', jobError);
          return res.status(500).json({ error: 'Error adding job', details: jobError });
        });
      }

      const jobID = jobResults.insertId;

      // Handle normal product jobs
      if (products.length > 0) {
        const productQueries = products.map(({ product, quantity, rawMaterials, cost }) => {
          return new Promise((resolve, reject) => {
            const productQuery = 'INSERT INTO NormalJob (JobID, ProductID, Quantity, Cost) VALUES (?, ?, ?, ?)';
            connection.query(productQuery, [jobID, product, quantity, cost], async (productError) => {
              if (productError) {
                return reject(productError);
              }

              // Process raw materials for the product
              const rawMaterialQueries = rawMaterials.map(({ material, quantity: rmQuantity }) => {
                return new Promise((resolveRM, rejectRM) => {
                  allocateBatch(jobID, product, material, rmQuantity * quantity, (allocationError) => {
                    if (allocationError) {
                      return rejectRM(allocationError);
                    }
                    resolveRM();
                  });
                });
              });

              Promise.all(rawMaterialQueries)
                .then(resolve)
                .catch(reject);
            });
          });
        });

        Promise.all(productQueries)
          .then(() => {
            connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  console.error('Error committing transaction:', commitError);
                  return res.status(500).json({ error: 'Error committing transaction', details: commitError });
                });
              }
              res.status(201).json({ message: 'Job added successfully' });
            });
          })
          .catch((productError) => {
            return connection.rollback(() => {
              console.error('Error adding products:', productError);
              return res.status(500).json({ error: 'Error adding products', details: productError });
            });
          });
      } else if (rawMaterials.length > 0) { // Handle customized product jobs
        const rawMaterialQueries = rawMaterials.map(({ material, quantity }) => {
          return new Promise((resolve, reject) => {
            const query = 'SELECT UnitPrice FROM BatchRawMaterial WHERE RawMaterialID = ?';
            connection.query(query, [material], (error, results) => {
              if (error) {
                return reject(error);
              }

              const unitPrice = results.length > 0 ? results[0].UnitPrice : 0;
              const cost = unitPrice * quantity;

              const rawMaterialQuery = 'INSERT INTO CustomJob (JobID, RawMaterialID, Quantity, CustomProductName, ImagePath, Cost) VALUES (?, ?, ?, ?, ?, ?)';
              connection.query(rawMaterialQuery, [jobID, material, quantity, customProductName, imagePath, cost], (rawMaterialError) => {
                if (rawMaterialError) {
                  return reject(rawMaterialError);
                }

                allocateBatch(jobID, null, material, quantity, (allocationError) => {
                  if (allocationError) {
                    return reject(allocationError);
                  }
                  resolve();
                });
              });
            });
          });
        });

        Promise.all(rawMaterialQueries)
          .then(() => {
            connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  console.error('Error committing transaction:', commitError);
                  return res.status(500).json({ error: 'Error committing transaction', details: commitError });
                });
              }
              res.status(201).json({ message: 'Job added successfully' });
            });
          })
          .catch((rawMaterialError) => {
            return connection.rollback(() => {
              console.error('Error adding raw materials:', rawMaterialError);
              return res.status(500).json({ error: 'Error adding raw materials', details: rawMaterialError });
           
            });
          });
      } else {
        connection.commit((commitError) => {
          if (commitError) {
            return connection.rollback(() => {
              console.error('Error committing transaction:', commitError);
              return res.status(500).json({ error: 'Error committing transaction', details: commitError });
            });
          }
          res.status(201).json({ message: 'Job added successfully' });
        });
      }
    });
  });
});

// Function to allocate batches for raw materials
const allocateBatch = (jobID, productID, rawMaterialID, requiredQuantity, callback) => {
  const query = `SELECT BatchID, Quantity 
                 FROM BatchRawMaterial 
                 WHERE RawMaterialID = ? AND Quantity > 0 
                 ORDER BY DateReceived`;

  connection.query(query, [rawMaterialID], (error, batches) => {
    if (error) {
      return callback(error);
    }

    let remainingQuantity = requiredQuantity;
    const allocations = [];

    for (const batch of batches) {
      if (remainingQuantity <= 0) break;

      const allocatedQuantity = Math.min(remainingQuantity, batch.Quantity);
      allocations.push({ BatchID: batch.BatchID, Quantity: allocatedQuantity });
      remainingQuantity -= allocatedQuantity;
    }

    if (remainingQuantity > 0) {
      return callback(new Error('Insufficient quantity in batches'));
    }

    const allocationQueries = allocations.map(({ BatchID, Quantity }) => {
      return new Promise((resolve, reject) => {
        const usageQuery = `INSERT INTO ProductBatchUsage (JobID, ProductID, RawMaterialID, BatchID, Quantity) VALUES (?, ?, ?, ?, ?)`;
        connection.query(usageQuery, [jobID, productID, rawMaterialID, BatchID, Quantity], (usageError) => {
          if (usageError) {
            return reject(usageError);
          }

          const batchQuery = `UPDATE BatchRawMaterial SET Quantity = Quantity - ? WHERE BatchID = ? AND RawMaterialID = ?`;
          connection.query(batchQuery, [Quantity, BatchID, rawMaterialID], (updateError) => {
            if (updateError) {
              return reject(updateError);
            }
            resolve();
          });
        });
      });
    });

    Promise.all(allocationQueries)
      .then(() => callback(null))
      .catch(callback);
  });
};

// Fetch products for a specific job
router.get('/:jobId/products', (req, res) => {
  const jobId = req.params.jobId;

  const productsQuery = `
    SELECT nj.NormalJobID, nj.ProductID, p.ProductName, nj.Quantity
    FROM NormalJob nj
    JOIN product p ON nj.ProductID = p.ProductID
    WHERE nj.JobID = ?
  `;

  connection.query(productsQuery, [jobId], (error, results) => {
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Error fetching products' });
    }

    res.json(results);
  });
});

// Fetch raw materials for a specific job
router.get('/:jobId/rawmaterials', (req, res) => {
  const jobId = req.params.jobId;

  const rawMaterialsQuery = `
    SELECT cj.CustomJobID, cj.RawMaterialID, rm.RawMaterial, cj.Quantity, cj.CustomProductName, cj.ImagePath
    FROM CustomJob cj
    JOIN rawmaterial rm ON cj.RawMaterialID = rm.RawMaterialID
    WHERE cj.JobID = ?
  `;

  connection.query(rawMaterialsQuery, [jobId], (error, results) => {
    if (error) {
      console.error('Error fetching raw materials:', error);
      return res.status(500).json({ error: 'Error fetching raw materials' });
    }

    res.json(results);
  });
});

// Fetch product batch usage for a specific job
router.get('/:jobId/productbatchusage', (req, res) => {
  const jobId = req.params.jobId;

  const productBatchUsageQuery = `
    SELECT pbu.UsageID, pbu.ProductID, p.ProductName, pbu.RawMaterialID, pbu.BatchID, pbu.Quantity
    FROM ProductBatchUsage pbu
    JOIN product p ON pbu.ProductID = p.ProductID
    WHERE pbu.JobID = ?
  `;

  connection.query(productBatchUsageQuery, [jobId], (error, results) => {
    if (error) {
      console.error('Error fetching product batch usage:', error);
      return res.status(500).json({ error: 'Error fetching product batch usage' });
    }

    res.json(results);
  });
});

// Fetch batches for a specific raw material
router.get('/rawmaterial/:rawMaterialId/batches', (req, res) => {
  const rawMaterialId = req.params.rawMaterialId;

  const batchQuery = `
    SELECT BatchID, RawMaterialID, Quantity, UnitPrice, DateReceived 
    FROM BatchRawMaterial 
    WHERE RawMaterialID = ?
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
