const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { json } = require('body-parser');

// Создание заказа
router.get('/zakaz', async (req, res) => {
    try {
        const userId = req.session.userId; // Предположим, ID пользователя сохранен в сессии

        if (!userId) {
            return res.redirect('/auth/login'); // Если пользователь не авторизован, перенаправляем на страницу входа
        }

        // Получение имени пользователя
        const [userRows] = await db.promise().query('SELECT FIO FROM customers WHERE customer_id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).render('error', { message: 'Пользователь не найден.' });
        }
        const userName = userRows[0].FIO;

        // Получение списка автомобилей пользователя
        const [cars] = await db.promise().query('SELECT car_id, mark, model FROM car WHERE customers_customer_id = ?', [userId]);

        // Рендерим страницу, передавая имя пользователя и автомобили
        res.render('../views/zakaz', { userName, cars });
    } catch (error) {
        console.error(error);
        res.render('error', { 
            message: 'Ошибка сервера.',
            error: { status: 500, stack: error.stack },
        }); 
    }
});
router.post('/zakaz', async (req, res) => {
    try {
        const customerId = req.session.userId; // ID текущего пользователя
        if (!customerId) {
            return res.status(401).render('error', { message: 'Пользователь не авторизован.' });
        }

        const { carId, address, additionalRequirements } = req.body;
        const services = req.body.services || []; // Предполагаем, что список услуг передается как массив

        if (!carId) {
            return res.status(400).render('error', { message: 'Автомобиль не выбран. Пожалуйста, выберите автомобиль.' });
        }

        // Получаем ID первого активного сотрудника
        const [employeeRows] = await db.promise().query(
            `SELECT employes_id FROM employes WHERE status = 'active' LIMIT 1`
        );

        if (employeeRows.length === 0) {
            return res.status(500).render('error', { message: 'Нет доступных сотрудников для обработки заказа.' });
        }
        const activeEmployeeId = employeeRows[0].employes_id;

        // Вставка нового заказа
        const [orderResult] = await db.promise().query(
            `INSERT INTO servis_orders 
            (servis_data, order_status, adress, customers_customer_id, car_car_id, employes_employes_id) 
            VALUES (NOW(), 'Создан', ?, ?, ?, ?)`,
            [address, customerId, carId, activeEmployeeId]
        );

        const orderId = orderResult.insertId; // ID созданного заказа

        // Вставка связанных услуг (если они указаны)
        if (Array.isArray(services) && services.length > 0) {
            for (const serviceId of services) {
                await db.promise().query(
                    `INSERT INTO servis_order_details 
                    (quantity, description, services_servis_id, servis_orders_order_id) 
                    VALUES (1, ?, ?, ?)`,
                    [additionalRequirements || '', serviceId, orderId]
                );
            }
        }

        // Перенаправление на страницу успешного оформления
        res.redirect(`/order/${orderId}`);
    } catch (error) {
        console.error(error);
        res.render('error', { 
            message: 'Ошибка сервера.',
            error: { status: 500, stack: error.stack },
        }); 
    }
});
module.exports = router;