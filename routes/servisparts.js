const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Получить все записи о запчастях
router.get('/', (req, res) => {
    const query = 'SELECT * FROM servis_parts';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получить запись о запчасти по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM servis_parts WHERE servis_part_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Запчасть не найдена' });
        res.status(200).json(results[0]);
    });
});

// Добавить новую запчасть
router.post('/', (req, res) => {
    const { inventory_id, quantity_parts, total_price, servis_orders_order_id } = req.body;
    const query = 'INSERT INTO servis_parts (inventory_id, quantity_parts, total_price, servis_orders_order_id) VALUES (?, ?, ?, ?)';
    db.query(query, [inventory_id, quantity_parts, total_price, servis_orders_order_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Запчасть добавлена', servisPartId: results.insertId });
    });
});

// Обновить данные запчасти по ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { inventory_id, quantity_parts, total_price, servis_orders_order_id } = req.body;
    const query = 'UPDATE servis_parts SET inventory_id = ?, quantity_parts = ?, total_price = ?, servis_orders_order_id = ? WHERE servis_part_id = ?';
    db.query(query, [inventory_id, quantity_parts, total_price, servis_orders_order_id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Запчасть не найдена' });
        res.status(200).json({ message: 'Запчасть обновлена' });
    });
});

// Удалить запчасть по ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM servis_parts WHERE servis_part_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Запчасть не найдена' });
        res.status(200).json({ message: 'Запчасть удалена' });
    });
});

module.exports = router;
