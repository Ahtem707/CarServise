const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Подключение к базе данных

// Получить все элементы инвентаря
router.get('/', (req, res) => {
    const query = 'SELECT * FROM inventory';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Получить элемент инвентаря по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM inventory WHERE inventory_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Элемент не найден' });
        res.status(200).json(result[0]);
    });
});

// Создать новый элемент инвентаря
router.post('/', (req, res) => {
    const { inventory_name, inventory_discription, quantity_in_stock, inventory_price, employes_employes_id, servis_parts_Servis_part_id } = req.body;
    const query = 'INSERT INTO inventory (inventory_name, inventory_discription, quantity_in_stock, inventory_price, employes_employes_id, servis_parts_Servis_part_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [inventory_name, inventory_discription, quantity_in_stock, inventory_price, employes_employes_id, servis_parts_Servis_part_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Элемент инвентаря добавлен', inventoryId: result.insertId });
    });
});

// Обновить элемент инвентаря по ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { inventory_name, inventory_discription, quantity_in_stock, inventory_price, employes_employes_id, servis_parts_Servis_part_id } = req.body;
    const query = 'UPDATE inventory SET inventory_name = ?, inventory_discription = ?, quantity_in_stock = ?, inventory_price = ?, employes_employes_id = ?, servis_parts_Servis_part_id = ? WHERE inventory_id = ?';
    db.query(query, [inventory_name, inventory_discription, quantity_in_stock, inventory_price, employes_employes_id, servis_parts_Servis_part_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Элемент не найден' });
        res.status(200).json({ message: 'Элемент инвентаря обновлен' });
    });
});

// Удалить элемент инвентаря по ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM inventory WHERE inventory_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Элемент не найден' });
        res.status(200).json({ message: 'Элемент инвентаря удален' });
    });
});

module.exports = router;