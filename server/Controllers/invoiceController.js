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
  const { customerID, jobID, date, status, lineItems } = req.body;

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const invoiceQuery = 'INSERT INTO invoices (CustomerID, JobID, Date, Status, TotalAmount) VALUES (?, ?, ?, ?, ?)';
    const totalAmount = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    connection.query(invoiceQuery, [customerID, jobID, date, status, totalAmount], (invoiceError, invoiceResults) => {
      if (invoiceError) {
        return connection.rollback(() => {
          console.error('Error adding invoice:', invoiceError);
          return res.status(500).json({ error: 'Error adding invoice' });
        });
      }

      const invoiceID = invoiceResults.insertId;
      const lineItemQueries = lineItems.map(({ description, quantity, price }) => {
        return new Promise((resolve, reject) => {
          const lineItemQuery = 'INSERT INTO invoice_line_items (InvoiceID, Description, Quantity, Price) VALUES (?, ?, ?, ?)';
          connection.query(lineItemQuery, [invoiceID, description, quantity, price], (lineItemError) => {
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

// Update an existing invoice
router.put('/:invoiceId', (req, res) => {
  const invoiceId = req.params.invoiceId;
  const { customerID, jobID, date, status, lineItems } = req.body;

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error starting transaction:', transactionError);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const invoiceUpdateQuery = 'UPDATE invoices SET CustomerID = ?, JobID = ?, Date = ?, Status = ?, TotalAmount = ? WHERE InvoiceID = ?';
    const totalAmount = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    connection.query(invoiceUpdateQuery, [customerID, jobID, date, status, totalAmount, invoiceId], (invoiceError) => {
      if (invoiceError) {
        return connection.rollback(() => {
          console.error('Error updating invoice:', invoiceError);
          return res.status(500).json({ error: 'Error updating invoice' });
        });
      }

      const deleteOldLineItemsQuery = 'DELETE FROM invoice_line_items WHERE InvoiceID = ?';
      connection.query(deleteOldLineItemsQuery, [invoiceId], (deleteError) => {
        if (deleteError) {
          return connection.rollback(() => {
            console.error('Error deleting old line items:', deleteError);
            return res.status(500).json({ error: 'Error deleting old line items' });
          });
        }

        const lineItemQueries = lineItems.map(({ description, quantity, price }) => {
          return new Promise((resolve, reject) => {
            const lineItemQuery = 'INSERT INTO invoice_line_items (InvoiceID, Description, Quantity, Price) VALUES (?, ?, ?, ?)';
            connection.query(lineItemQuery, [invoiceId, description, quantity, price], (lineItemError) => {
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
              res.status(200).json({ message: 'Invoice updated successfully' });
            });
          })
          .catch((lineItemError) => {
            return connection.rollback(() => {
              console.error('Error updating line items:', lineItemError);
              return res.status(500).json({ error: 'Error updating line items' });
            });
          });
      });
    });
  });
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

module.exports = router;
