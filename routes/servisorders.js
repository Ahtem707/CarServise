const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Получить все заказы
router.get('/', (req, res) => {
    const query = 'SELECT * FROM servis_orders';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получить заказ по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM servis_orders WHERE order_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Заказ не найден' });
        res.status(200).json(results[0]);
    });
});

// Добавить новый заказ
router.post('/', (req, res) => {
    const { servis_data, total_amount, order_status, adress, car_car_id, customers_customer_id } = req.body;
    const query = 'INSERT INTO servis_orders (servis_data, total_amount, order_status, adress, car_car_id, customers_customer_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [servis_data, total_amount, order_status, adress, car_car_id, customers_customer_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Заказ добавлен', orderId: results.insertId });
    });
});

// Обновить данные заказа по ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { servis_data, total_amount, order_status, adress, car_car_id, customers_customer_id } = req.body;
    const query = 'UPDATE servis_orders SET servis_data = ?, total_amount = ?, order_status = ?, adress = ?, car_car_id = ?, customers_customer_id = ? WHERE order_id = ?';
    db.query(query, [servis_data, total_amount, order_status, adress, car_car_id, customers_customer_id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Заказ не найден' });
        res.status(200).json({ message: 'Заказ обновлен' });
    });
});

// Удалить заказ по ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM servis_orders WHERE order_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Заказ не найден' });
        res.status(200).json({ message: 'Заказ удален' });
    });
});

module.exports = router;