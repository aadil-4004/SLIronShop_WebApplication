const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Config/db');

const router = express.Router();

router.use(bodyParser.json());

router.post('/login', (req, res, next) => {
    const { UserName, Password } = req.body;

    try {
        connection.query('SELECT Password, UserType FROM user WHERE UserName = ?', [UserName], (err, rows) => {
            if (err) {
                console.error('Error querying MySQL database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length == 1) {
                const storedPassword = rows[0].Password;

                if (Password === storedPassword) {
                    const { UserType } = rows[0];
                    res.json({ UserType });
                } else {
                    res.status(401).json({ error: 'Invalid username or password' });
                }
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        });
    } catch (err) {
        console.error('Error querying MySQL database:', err);
        next(err);
    }
});

module.exports = router;
