const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '94.250.252.36',
    user: 'car_service',
    password: 'car_service',
    database: 'car_service'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных: ', err);
        return;
    }
    console.log('Подключено к базе данных');
});

module.exports = db;