const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Убедитесь, что путь к файлу с подключением правильный

// Получить все типы топлива
router.get('/', (req, res) => {
    const query = 'SELECT * FROM fuel_types';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получить тип топлива по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM fuel_types WHERE fuel_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Тип топлива не найден' });
        res.status(200).json(result[0]);
    });
});

// Создать новый тип топлива
router.post('/', (req, res) => {
    const { fuel_name, fuel_price } = req.body;
    const query = 'INSERT INTO fuel_types (fuel_name, fuel_price) VALUES (?, ?)';
    db.query(query, [fuel_name, fuel_price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Тип топлива добавлен', fuelId: result.insertId });
    });
});

// Обновить тип топлива по ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { fuel_name, fuel_price } = req.body;
    const query = 'UPDATE fuel_types SET fuel_name = ?, fuel_price = ? WHERE fuel_id = ?';
    db.query(query, [fuel_name, fuel_price, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Тип топлива не найден' });
        res.status(200).json({ message: 'Тип топлива обновлен' });
    });
});

// Удалить тип топлива по ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM fuel_types WHERE fuel_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Тип топлива не найден' });
        res.status(200).json({ message: 'Тип топлива удален' });
    });
});

module.exports = router;