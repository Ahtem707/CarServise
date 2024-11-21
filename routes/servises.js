const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Убедитесь, что подключение к базе данных настроено правильно

// Получение всех услуг
router.get('/', (req, res) => {
    const query = 'SELECT * FROM servises';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получение услуги по ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM servises WHERE servis_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Услуга не найдена' });
        res.status(200).json(results[0]);
    });
});

// Добавление новой услуги
router.post('/', (req, res) => {
    const { servis_name, servis_price } = req.body;
    const query = 'INSERT INTO servises (servis_name, servis_price) VALUES (?, ?)';
    db.query(query, [servis_name, servis_price], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Услуга добавлена', servisId: results.insertId });
    });
});

// Обновление услуги по ID
router.put('/:id', (req, res) => {
    const { servis_name, servis_price } = req.body;
    const query = 'UPDATE servises SET servis_name = ?, servis_price = ? WHERE servis_id = ?';
    db.query(query, [servis_name, servis_price, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Услуга не найдена' });
        res.status(200).json({ message: 'Услуга обновлена' });
    });
});

// Удаление услуги по ID
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM servises WHERE servis_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Услуга не найдена' });
        res.status(200).json({ message: 'Услуга удалена' });
    });
});

module.exports = router;