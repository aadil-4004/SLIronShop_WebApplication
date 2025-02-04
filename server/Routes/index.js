const express = require('express');
const bodyParser = require('body-parser');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');
const customerController = require('../Controllers/customerController'); 
const productController = require('../Controllers/productController');
const rawmaterialController = require('../Controllers/rawmaterialController');
const supplierController = require('../Controllers/supplierController');
const batchRawMaterialController = require('../Controllers/batchRawMaterialController');
const catalogueController = require('../Controllers/catalogueController');
const jobController = require('../Controllers/jobController');
const invoiceController = require('../Controllers/invoiceController');
const dashboardController = require('../Controllers/dashboardController');

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
app.use('/api/customers', customerController);
app.use('/api/product', productController);
app.use('/api/rawmaterial', rawmaterialController);
app.use('/api/', supplierController);
app.use('/api/batchrawmaterial', batchRawMaterialController)
app.use('/api/catalogue', catalogueController);  // Updated path
app.use('/api/jobs', jobController);  // Updated path
app.use('/api/invoices', invoiceController);  // Updated path
app.use('/api/dashboard', dashboardController);

app.use('/uploads', express.static('uploads'));



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
