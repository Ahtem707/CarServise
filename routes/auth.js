const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const bcrypt = require('bcrypt');
// Роуты для отображения форм
router.get('/login', (req, res) => {
    res.render('../views/2reg.ejs'); // Убедитесь, что файл views/login.ejs существует
});
router.get('/reg', (req, res) => {
    res.render('../views/2reg.ejs'); // Убедитесь, что файл views/auth/2reg.ejs существует
});

// Регистрация пользователя
router.post('/reg', async (req, res) => {
    const { fio, email, phone, password, confirmPassword } = req.body;

    if (!fio || !email || !phone || !password || !confirmPassword) {
        req.session.error = 'Пожалуйста, заполните все поля.';
        return res.redirect('/auth/reg');
    }

    if (password.trim() !== confirmPassword.trim()) {
        req.session.error = 'Пароли не совпадают.';
        return res.redirect('/auth/reg');
    }

    try {
        const [existingUser] = await db.promise().query(
            'SELECT * FROM customers WHERE email = ?',
            [email]
        );

        if (Array.isArray(existingUser) && existingUser.length > 0) {
            req.session.error = 'Пользователь с таким email уже существует.';
            return res.redirect('/auth/reg');
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        await db.promise().query(
            'INSERT INTO customers (FIO, email, phone, password) VALUES (?, ?, ?, ?)',
            [fio.trim(), email.trim(), phone.trim(), hashedPassword]
        );

        req.session.success = 'Пользователь успешно зарегистрирован!';
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        req.session.error = 'Ошибка сервера.';
        res.redirect('/auth/reg');
    }
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.session.error = 'Введите email и пароль.';
        return res.redirect('/login');
    }

    try {
        const query = 'SELECT * FROM customers WHERE email = ?';
        const [rows] = await db.promise().query(query, [email]);

        if (rows.length === 0) {
            req.session.error = 'Пользователь не найден!';
            return res.redirect('/login');
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            req.session.error = 'Неверный пароль!';
            return res.redirect('/login');
        }

        req.session.userId = user.customer_id;
        req.session.email = user.email;

        res.redirect('/home');
    } catch (error) {
        console.error(error);
        req.session.error = 'Ошибка сервера.';
        res.redirect('/login');
    }
});

router.post('/reset-password', async (req, res) => {
    console.log('Request body:', req.body); // Отобразит данные, полученные от формы
    try {
        const { newPassword, confirmPassword } = req.body;

        // Проверка на пустые поля
        if (!newPassword || !confirmPassword) {
            console.log('Empty fields:', { newPassword, confirmPassword });
            return res.status(400).send('Пожалуйста, заполните все поля.');
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).send('Пароли не совпадают.');
        }

        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

        // Обновление пароля
        const query = 'UPDATE customers SET password = ? WHERE customer_id = ?';
        await db.promise().query(query, [hashedPassword, req.session.userId]);

        res.redirect('/login');
    } catch (error) {
        console.error('Ошибка обновления пароля:', error);
        res.status(500).send('Произошла ошибка, попробуйте снова.');
    }
});
module.exports = router;