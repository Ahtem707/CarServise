const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'xbox1337',
    database: 'mydb'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных: ', err);
        return;
    }
    console.log('Подключено к базе данных');
});

module.exports = db;