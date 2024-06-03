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
router.get('/product', (req, res) => {
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
router.get('/product/categories', (req, res) => {
  connection.query('SELECT CategoryID, CategoryName FROM category', (error, results) => {
    if (error) {
      console.error('Error retrieving categories:', error);
      res.status(500).json({ error: 'Error retrieving categories' });
    } else {
      res.json(results);
    }
  });
});

// Add a new product
router.post('/product', upload.single('image'), (req, res) => {
  const { productName, workmanCharge, mrp, category } = req.body;
  const imagePath = req.file ? req.file.path : null;

  connection.query(
    'INSERT INTO product (ProductName, WorkmanCharge, MRP, Category, Image) VALUES (?, ?, ?, ?, ?)',
    [productName, workmanCharge, mrp, category, imagePath],
    (error, results) => {
      if (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Error adding product' });
      } else {
        res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
      }
    }
  );
});

module.exports = router;
