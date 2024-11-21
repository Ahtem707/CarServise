const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Убедитесь, что путь к файлу с подключением правильный

// Получить все записи рабочего журнала
router.get('/', (req, res) => {
    const query = 'SELECT * FROM employ_work_log';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получить запись рабочего журнала по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM employ_work_log WHERE work_log_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Запись не найдена' });
        res.status(200).json(result[0]);
    });
});

// Создать новую запись в рабочем журнале
router.post('/', (req, res) => {
    const { order_id, work_hours, work_discriptor, employes_employes_id } = req.body;
    const query = 'INSERT INTO employ_work_log (order_id, work_hours, work_discriptor, employes_employes_id) VALUES (?, ?, ?, ?)';
    db.query(query, [order_id, work_hours, work_discriptor, employes_employes_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Запись добавлена', workLogId: result.insertId });
    });
});

// Обновить запись рабочего журнала по ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { order_id, work_hours, work_discriptor, employes_employes_id } = req.body;
    const query = 'UPDATE employ_work_log SET order_id = ?, work_hours = ?, work_discriptor = ?, employes_employes_id = ? WHERE work_log_id = ?';
    db.query(query, [order_id, work_hours, work_discriptor, employes_employes_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Запись не найдена' });
        res.status(200).json({ message: 'Запись обновлена' });
    });
});

// Удалить запись рабочего журнала по ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM employ_work_log WHERE work_log_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Запись не найдена' });
        res.status(200).json({ message: 'Запись удалена' });
    });
});

module.exports = router;