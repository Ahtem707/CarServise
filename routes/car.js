const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Получить все машины
router.get('/', (req, res) => {
    const query = 'SELECT * FROM car';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получить машину по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM car WHERE car_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Машина не найдена' });
        res.status(200).json(results[0]);
    });
});

// Добавить новую машину
router.post('/', (req, res) => {
    const { mark, model, year, gos_nomer, wincode, customers_customer_id } = req.body;
    const query = 'INSERT INTO car (mark, model, year, gos_nomer, wincode, customers_customer_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [mark, model, year, gos_nomer, wincode, customers_customer_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Машина добавлена', carId: results.insertId });
    });
});

// Обновить данные машины по ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { mark, model, year, gos_nomer, wincode, customers_customer_id } = req.body;
    const query = 'UPDATE car SET mark = ?, model = ?, year = ?, gos_nomer = ?, wincode = ?, customers_customer_id = ? WHERE car_id = ?';
    db.query(query, [mark, model, year, gos_nomer, wincode, customers_customer_id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Машина не найдена' });
        res.status(200).json({ message: 'Машина обновлена' });
    });
});

// Удалить машину по ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM car WHERE car_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Машина не найдена' });
        res.status(200).json({ message: 'Машина удалена' });
    });
});

module.exports = router;