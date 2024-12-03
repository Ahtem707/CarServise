const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Подключение к базе данных

// Маршрут для добавления автомобиля
router.post('/', async (req, res) => {
    try {
        const { brand, model, year, registrationNumber, vin } = req.body;

        // Проверяем, что все поля заполнены
        if (!brand || !model || !year || !registrationNumber || !vin) {
            req.session.error = 'Все поля должны быть заполнены.';
            return res.redirect('/car');
        }

        const customerId = req.session.userId; // Получаем ID клиента из сессии
        const query = `
            INSERT INTO car (mark, model, year, gos_nomer, wincode, customers_customer_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Выполняем запрос в базу данных
        await db.promise().query(query, [brand, model, year, registrationNumber, vin, customerId]);

        req.session.success = 'Автомобиль успешно зарегистрирован!';
        res.redirect('/car');
    } catch (error) {
        console.error('Ошибка при добавлении автомобиля:', error);
        req.session.error = 'Произошла ошибка при регистрации автомобиля.';
        res.redirect('/car');
    }
});

// Рендер страницы для добавления автомобиля
router.get('/', (req, res) => {
    res.render('6regauto'); // Убедитесь, что файл views/car.ejs существует
});

module.exports = router;