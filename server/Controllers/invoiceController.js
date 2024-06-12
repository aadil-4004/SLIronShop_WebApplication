const express = require('express');
const router = express.Router();
const connection = require('../Config/db');
const cors = require('cors');

router.use(cors());

// Fetch all invoices
router.get('/', (req, res) => {
  const query = `
    SELECT i.*, c.CustomerName, j.DueDate, j.Status AS JobStatus, j.Note, j.EmployeeName
    FROM invoices i
    JOIN customers c ON i.CustomerID = c.CustomerID
    JOIN jobs j ON i.JobID = j.JobID
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving invoices:', error);
      res.status(500).json({ error: 'Error retrieving invoices' });
    } else {
      res.json(results);
    }
  });
});

// Fetch an invoice by ID
router.get('/:invoiceId', (req, res) => {
  const invoiceId = req.params.invoiceId;

  const query = `
    SELECT i.*, c.CustomerName, j.DueDate, j.Status AS JobStatus, j.Note, j.EmployeeName
    FROM invoices i
    JOIN customers c ON i.CustomerID = c.CustomerID
    JOIN jobs j ON i.JobID = j.JobID
    WHERE i.InvoiceID = ?
  `;
  connection.query(query, [invoiceId], (error, results) => {
    if (error) {
      console.error('Error retrieving invoice:', error);
      res.status(500).json({ error: 'Error retrieving invoice' });
    } else {
      res.json(results[0]);
    }
  });
});

// Fetch line items for a specific invoice
router.get('/:invoiceId/lineitems', (req, res) => {
  const invoiceId = req.params.invoiceId;

  const query = `
    SELECT * FROM invoice_line_items
    WHERE InvoiceID = ?
  `;
  connection.query(query, [invoiceId], (error, results) => {
    if (error) {
      console.error('Error retrieving line items:', error);
      res.status(500).json({ error: 'Error retrieving line items' });
    } else {
      res.json(results);
    }
  });
});

// Add a new invoice
router.post('/', (req, res) => {
  const { customerID, jobID, status, totalAmount, discountAmount, totalBillAmount, advancePayment, balance, lineItems } = req.body;
  const date = new Date(); // Current timestamp

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const invoiceQuery = 'INSERT INTO invoices (CustomerID, JobID, Date, Status, TotalAmount, DiscountAmount, TotalBillAmount, AdvancePayment, Balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(invoiceQuery, [customerID, jobID, date, status, totalAmount, discountAmount, totalBillAmount, advancePayment, balance], (invoiceError, invoiceResults) => {
      if (invoiceError) {
        return connection.rollback(() => {
          console.error('Error adding invoice:', invoiceError);
          return res.status(500).json({ error: 'Error adding invoice' });
        });
      }

      const invoiceID = invoiceResults.insertId;
      const lineItemQueries = lineItems.map(({ description, quantity, price, totalCost, grossProfit }) => {
        return new Promise((resolve, reject) => {
          const lineItemQuery = 'INSERT INTO invoice_line_items (InvoiceID, Description, Quantity, Price, TotalCost, GrossProfit) VALUES (?, ?, ?, ?, ?, ?)';
          connection.query(lineItemQuery, [invoiceID, description, quantity, price, totalCost, grossProfit], (lineItemError) => {
            if (lineItemError) {
              return reject(lineItemError);
            }
            resolve();
          });
        });
      });

      Promise.all(lineItemQueries)
        .then(() => {
          connection.commit((commitError) => {
            if (commitError) {
              return connection.rollback(() => {
                console.error('Error committing transaction:', commitError);
                return res.status(500).json({ error: 'Error committing transaction' });
              });
            }
            res.status(201).json({ message: 'Invoice added successfully' });
          });
        })
        .catch((lineItemError) => {
          return connection.rollback(() => {
            console.error('Error adding line items:', lineItemError);
            return res.status(500).json({ error: 'Error adding line items' });
          });
        });
    });
  });
});

// Fetch job details
router.get('/jobdetails/:jobId', (req, res) => {
  const jobId = req.params.jobId;

  const query = `
    SELECT j.*, 
           p.ProductName, 
           p.MRP, 
           p.WorkmanCharge,
           nj.Quantity AS ProductQuantity,
           nj.Cost AS ProductCost,
           c.CustomProductName, 
           c.ImagePath,
           SUM(c.Cost) AS CustomProductCost,
           pb.BatchID,
           brm.RawMaterialID,
           brm.UnitPrice,
           rm.RawMaterial,
           pb.Quantity AS BatchQuantity
    FROM jobs j
    LEFT JOIN normaljob nj ON j.JobID = nj.JobID
    LEFT JOIN Product p ON nj.ProductID = p.ProductID
    LEFT JOIN customjob c ON j.JobID = c.JobID
    LEFT JOIN productbatchusage pb ON j.JobID = pb.JobID
    LEFT JOIN batchrawmaterial brm ON pb.BatchID = brm.BatchID
    LEFT JOIN rawmaterial rm ON brm.RawMaterialID = rm.RawMaterialID
    WHERE j.JobID = ?
    GROUP BY j.JobID, p.ProductID, c.CustomProductName, pb.BatchID
  `;

  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error retrieving job details:', error);
      res.status(500).json({ error: 'Error retrieving job details' });
    } else {
      const jobDetails = {
        products: [],
        customProduct: null,
        batches: [],
      };

      results.forEach(row => {
        if (row.ProductName) {
          jobDetails.products.push({
            ProductName: row.ProductName,
            MRP: row.MRP,
            WorkmanCharge: row.WorkmanCharge,
            Quantity: row.ProductQuantity,
            Cost: row.ProductCost,
          });
        }
        if (row.CustomProductName) {
          jobDetails.customProduct = {
            CustomProductName: row.CustomProductName,
            ImagePath: row.ImagePath,
            Cost: row.CustomProductCost,
          };
        }
        if (row.BatchID) {
          jobDetails.batches.push({
            BatchID: row.BatchID,
            RawMaterialName: row.RawMaterial,
            BatchQuantity: row.BatchQuantity,
            UnitPrice: row.UnitPrice,
          });
        }
      });

      res.json(jobDetails);
    }
  });
});

// Update an existing invoice
router.put('/:invoiceId', (req, res) => {
    const invoiceId = req.params.invoiceId;
    const { status, balance } = req.body;
  
    connection.query(
      'UPDATE invoices SET Status = ?, Balance = ? WHERE InvoiceID = ?',
      [status, balance, invoiceId],
      (error, results) => {
        if (error) {
          console.error('Error updating invoice:', error);
          return res.status(500).json({ error: 'Error updating invoice' });
        }
        res.status(200).json({ message: 'Invoice updated successfully' });
      }
    );
  });
  

// Delete an invoice
router.delete('/:invoiceId', (req, res) => {
  const invoiceId = req.params.invoiceId;

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const deleteLineItemsQuery = 'DELETE FROM invoice_line_items WHERE InvoiceID = ?';
    connection.query(deleteLineItemsQuery, [invoiceId], (deleteLineItemsError) => {
      if (deleteLineItemsError) {
        return connection.rollback(() => {
          console.error('Error deleting line items:', deleteLineItemsError);
          return res.status(500).json({ error: 'Error deleting line items' });
        });
      }

      const deleteInvoiceQuery = 'DELETE FROM invoices WHERE InvoiceID = ?';
      connection.query(deleteInvoiceQuery, [invoiceId], (deleteInvoiceError) => {
        if (deleteInvoiceError) {
          return connection.rollback(() => {
            console.error('Error deleting invoice:', deleteInvoiceError);
            return res.status(500).json({ error: 'Error deleting invoice' });
          });
        }

        connection.commit((commitError) => {
          if (commitError) {
            return connection.rollback(() => {
              console.error('Error committing transaction:', commitError);
              return res.status(500).json({ error: 'Error committing transaction' });
            });
          }
          res.status(200).json({ message: 'Invoice deleted successfully' });
        });
      });
    });
  });
});

// Fetch jobs by CustomerID
router.get('/jobs/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;

  const query = `
    SELECT JobID, DueDate
    FROM jobs
    WHERE CustomerID = ?
  `;

  connection.query(query, [customerId], (error, results) => {
    if (error) {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ error: 'Error retrieving jobs' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
