const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Endpoint untuk menerima pesanan
app.post('/api/order', (req, res) => {
    const order = req.body;
    const orderFilePath = path.join(__dirname, 'data', 'orders.json');

    // Baca file pemesanan
    fs.readFile(orderFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading order file');
        }

        // Parse data pemesanan dan tambahkan pemesanan baru
        const orders = JSON.parse(data || '[]');
        orders.push(order);

        // Tulis kembali ke file
        fs.writeFile(orderFilePath, JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing order file');
            }
            res.status(201).send('Order received');
        });
    });
});

// Endpoint untuk mengambil data pemesanan
app.get('/api/orders', (req, res) => {
    const orderFilePath = path.join(__dirname, 'data', 'orders.json');

    fs.readFile(orderFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading order file');
        }
        res.status(200).json(JSON.parse(data || '[]'));
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
