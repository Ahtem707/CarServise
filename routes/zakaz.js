const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET запрос на страницу заказа
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Получаем ID пользователя из сессии
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
        res.render('9pd', { fio: userName, cars });
    } catch (error) {
        console.error(error);
        res.render('error', { 
            message: 'Ошибка сервера.',
            error: { status: 500, stack: error.stack },
        }); 
    }
});

// POST запрос на создание заказа
router.post('/', async (req, res) => {
    try {
        const customerId = req.session.userId; // ID текущего пользователя
        if (!customerId) {
            return res.status(401).render('error', { message: 'Пользователь не авторизован.' });
        }

        const { carId, address, additionalRequirements, services } = req.body;

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
            [address || '', customerId, carId, activeEmployeeId]
        );

        const orderId = orderResult.insertId;

        // Вставка связанных услуг (если они указаны)
        if (Array.isArray(services) && services.length > 0) {
            for (const serviceId of services) {
                // Получаем цену услуги
                const [serviceRows] = await db.promise().query(
                    `SELECT servis_price FROM servises WHERE servis_id = ?`,
                    [serviceId]
                );

                if (serviceRows.length === 0) {
                    console.error(`Услуга с ID ${serviceId} не найдена.`);
                    continue; // Переходим к следующей услуге
                }

                const servicePrice = parseFloat(serviceRows[0].servis_price) || 0; // Преобразуем в число и обрабатываем NaN
                const quantity = 1; // Если количество фиксировано, иначе замените на req.body.quantity
                const subtotal = servicePrice * quantity;

                if (isNaN(subtotal)) {
                    console.error(`Ошибка расчета subtotal для serviceId ${serviceId}`);
                    continue;
                }

                await db.promise().query(
                    `INSERT INTO servis_order_details 
                    (quantity, description, servises_servis_id, servis_orders_order_id, subtotal) 
                    VALUES (?, ?, ?, ?, ?)`,
                    [quantity, additionalRequirements || '', serviceId, orderId, subtotal]
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