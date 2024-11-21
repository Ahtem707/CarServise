const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Получить все записи
router.get('/', (req, res) => {
    const query = 'SELECT * FROM servis_order_details';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Получить запись по ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM servis_order_details WHERE order_detail_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// Создать новую запись
router.post('/', (req, res) => {
    const { quantity, subtotal, servises_servis_id, servis_orders_order_id } = req.body;
    const query = 'INSERT INTO servis_order_details (quantity, subtotal, servises_servis_id, servis_orders_order_id) VALUES (?, ?, ?, ?)';
    db.query(query, [quantity, subtotal, servises_servis_id, servis_orders_order_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Запись создана', orderDetailId: result.insertId });
    });
});

// Обновить запись по ID
router.put('/:id', (req, res) => {
    const { quantity, subtotal, servises_servis_id, servis_orders_order_id } = req.body;
    const query = 'UPDATE servis_order_details SET quantity = ?, subtotal = ?, servises_servis_id = ?, servis_orders_order_id = ? WHERE order_detail_id = ?';
    db.query(query, [quantity, subtotal, servises_servis_id, servis_orders_order_id, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Запись обновлена' });
    });
});

// Удалить запись по ID
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM servis_order_details WHERE order_detail_id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Запись удалена' });
    });
});

module.exports = router;