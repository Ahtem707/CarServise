const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Получить все платежи
router.get('/', (req, res) => {
    const query = 'SELECT * FROM payments';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получить платеж по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM payments WHERE payment_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Платеж не найден' });
        res.status(200).json(results[0]);
    });
});

// Добавить новый платеж
router.post('/', (req, res) => {
    const { payment_data, payment_amount, payment_metod, servis_order_details_order_detail_id, servis_orders_order_id } = req.body;
    const query = 'INSERT INTO payments (payment_data, payment_amount, payment_metod, servis_order_details_order_detail_id, servis_orders_order_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [payment_data, payment_amount, payment_metod, servis_order_details_order_detail_id, servis_orders_order_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Платеж добавлен', paymentId: results.insertId });
    });
});

// Обновить данные платежа по ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { payment_data, payment_amount, payment_metod, servis_order_details_order_detail_id, servis_orders_order_id } = req.body;
    const query = 'UPDATE payments SET payment_data = ?, payment_amount = ?, payment_metod = ?, servis_order_details_order_detail_id = ?, servis_orders_order_id = ? WHERE payment_id = ?';
    db.query(query, [payment_data, payment_amount, payment_metod, servis_order_details_order_detail_id, servis_orders_order_id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Платеж не найден' });
        res.status(200).json({ message: 'Платеж обновлен' });
    });
});

// Удалить платеж по ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM payments WHERE payment_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Платеж не найден' });
        res.status(200).json({ message: 'Платеж удален' });
    });
});

module.exports = router;