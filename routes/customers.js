const express = require('express');
const db = require('../db/connection');

const router = express.Router();

// Получение всех клиентов
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Customers';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Получение клиента по ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM Customers WHERE customer_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Клиент не найден' });
        res.json(results[0]);
    });
});

// Создание нового клиента
router.post('/', (req, res) => {
    const { FIO, email, phone, data_registrat, total_cost } = req.body;
    const query = 'INSERT INTO Customers (FIO, email, phone, data_registrat, total_cost) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [FIO, email, phone, data_registrat, total_cost], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Клиент добавлен', customerId: results.insertId });
    });
});

// Обновление данных клиента
router.put('/:id', (req, res) => {
    const { FIO, email, phone, data_registrat, total_cost } = req.body;
    const query = 'UPDATE Customers SET FIO = ?, email = ?, phone = ?, data_registrat = ?, total_cost = ? WHERE customer_id = ?';
    db.query(query, [FIO, email, phone, data_registrat, total_cost, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Клиент не найден' });
        res.json({ message: 'Данные клиента обновлены' });
    });
});

// Удаление клиента
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM Customers WHERE customer_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Клиент не найден' });
        res.json({ message: 'Клиент удален' });
    });
});

module.exports = router;