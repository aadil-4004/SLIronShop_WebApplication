const express = require('express');
const bodyParser = require('body-parser');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');
const customerController = require('../Controllers/customerController'); // Import the customer controller
const productController = require('../Controllers/productController')
const rawmaterialController = require('../Controllers/rawmaterialController')

const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
}));

app.use(bodyParser.json());

app.use('/api/auth', authController);
app.use('/api/user', userController);
app.use('/api/customers', customerController); // Route for fetching customers
app.use('/api/product', productController)
app.use('/api/rawmaterial', rawmaterialController)

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.code === 'ECONNREFUSED') {
        res.status(500).json({ error: 'Database connection refused' });
    } else {
        console.error(err.stack);
        res.status(500).json({ error: err.message || 'Something went wrong!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
