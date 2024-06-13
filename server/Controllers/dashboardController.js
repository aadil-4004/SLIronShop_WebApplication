const express = require('express');
const router = express.Router();
const connection = require('../Config/db');

router.get('/getInvoiceDetails', (req, res) => {
    const query = `
      SELECT DATE(Date) AS Date, SUM(TotalBillAmount) AS TotalBillAmount
      FROM invoices
      GROUP BY DATE(Date)
      ORDER BY Date
    `;
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching invoice details:', error);
        res.status(500).json({ error: 'Error fetching invoice details' });
      } else {
        res.json(results);
      }
    });
  });

  router.get('/top-performing-products', (req, res) => {
    const query = `
      SELECT Description, SUM(Quantity) AS TotalSold, SUM(GrossProfit) AS Profit
      FROM invoice_line_items
      GROUP BY Description
      ORDER BY TotalSold DESC
      LIMIT 3
    `;
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching top performing products:', error);
        res.status(500).json({ error: 'Error fetching top performing products' });
      } else {
        res.json(results);
      }
    });
  });
  
module.exports = router;


