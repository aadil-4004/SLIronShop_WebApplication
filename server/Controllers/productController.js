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

// Add a new product
router.post('/', (req, res) => {
    const { productName, instock, price, category } = req.body;
    connection.query('INSERT INTO product (ProductName, InStock, Price, Category) VALUES (?, ?, ?, ?)',
    [productName, instock, price, category], (error, results) => {
        if (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ error: 'Error adding product' });
        } else {
            res.json({ message: 'Product added successfully' });
        }
    });
});

// Update an existing product
router.put('/:productId', (req, res) => {
    const productId = req.params.productId;
    const { productName, instock, price, category } = req.body;
    connection.query('UPDATE product SET ProductName = ?, InStock = ?, Price = ?, Category = ? WHERE ProductID = ?',
    [productName, instock, price, category, productId], (error, results) => {
        if (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Error updating product' });
        } else {
            res.json({ message: 'Product updated successfully' });
        }
    });
});

module.exports = router;
