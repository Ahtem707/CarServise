const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET запрос для страницы личного кабинета
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId; // ID текущего пользователя
        if (!userId) {
            return res.redirect('/auth/login'); // Перенаправление на страницу входа, если пользователь не авторизован
        }

        // Получение информации о пользователе
        const [userRows] = await db.promise().query('SELECT FIO, phone FROM customers WHERE customer_id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).render('error', { message: 'Пользователь не найден.' });
        }
        const user = userRows[0];

        // Получение списка машин пользователя
        const [cars] = await db.promise().query('SELECT mark, model FROM car WHERE customers_customer_id = ?', [userId]);

        // Рендер страницы с данными пользователя и автомобилей
        res.render('4lk', { fio: user.FIO, phone: user.phone, cars });
    } catch (error) {
        console.error(error);
        res.render('error', {
            message: 'Ошибка сервера.',
            error: { status: 500, stack: error.stack },
        });
    }
});

// POST запрос для добавления нового автомобиля
router.post('/add-car', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Пользователь не авторизован.' });
        }

        const { mark, model } = req.body;

        if (!mark || !model) {
            return res.status(400).json({ error: 'Марка и модель автомобиля обязательны.' });
        }

        // Добавление нового автомобиля
        await db.promise().query(
            'INSERT INTO car (mark, model, customers_customer_id) VALUES (?, ?, ?)',
            [mark, model, userId]
        );

        res.status(200).json({ message: 'Автомобиль успешно добавлен.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера.' });
    }
});

module.exports = router;
